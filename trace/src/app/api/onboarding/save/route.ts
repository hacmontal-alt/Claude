import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
  try {
    const { brandName, brandUrl, market, language, topics, competitors } = await req.json();

    if (!brandName || !brandUrl) {
      return NextResponse.json({ error: 'Brand name and URL required' }, { status: 400 });
    }

    // Get the authenticated user from cookies
    const supabaseAuth = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return req.cookies.getAll();
          },
          setAll() {},
        },
      }
    );

    const { data: { user } } = await supabaseAuth.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated. Please sign in first.' }, { status: 401 });
    }

    // Use service role client to bypass RLS for inserts
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Check if user already has an org
    const { data: existingProfile } = await supabase
      .from('user_profiles')
      .select('org_id')
      .eq('id', user.id)
      .single();

    let orgId: string;

    if (existingProfile?.org_id) {
      orgId = existingProfile.org_id;
    } else {
      // Create org for this user
      const { data: org, error: orgError } = await supabase
        .from('organizations')
        .insert({
          name: user.user_metadata?.full_name || brandName,
          plan: 'free',
          owner_user_id: user.id,
        })
        .select()
        .single();

      if (orgError) {
        console.error('Failed to create org:', orgError);
        return NextResponse.json({ error: 'Failed to save brand data' }, { status: 500 });
      }

      orgId = org.id;

      // Create user profile
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          id: user.id,
          org_id: orgId,
          role: 'owner',
        });

      if (profileError) {
        console.error('Failed to create profile:', profileError);
      }
    }

    // Create brand
    const { data: brand, error: brandError } = await supabase
      .from('brands')
      .insert({
        org_id: orgId,
        brand_name: brandName,
        brand_url: brandUrl,
        market: market || 'US',
        language: language || 'en',
      })
      .select()
      .single();

    if (brandError) {
      console.error('Failed to create brand:', brandError);
      return NextResponse.json({ error: 'Failed to save brand' }, { status: 500 });
    }

    // Create topics and prompts
    if (topics && Array.isArray(topics)) {
      for (const topic of topics) {
        const { data: dbTopic, error: topicError } = await supabase
          .from('topics')
          .insert({
            brand_id: brand.id,
            name: topic.name,
          })
          .select()
          .single();

        if (topicError) {
          console.error('Failed to create topic:', topicError);
          continue;
        }

        if (topic.prompts && Array.isArray(topic.prompts)) {
          const promptRows = topic.prompts
            .filter((p: any) => p.checked !== false)
            .map((p: any) => ({
              brand_id: brand.id,
              topic_id: dbTopic.id,
              prompt_text: p.text,
              estimated_volume: p.estimatedVolume || 0,
              tags: p.tags || [],
              market: market || 'US',
              language: language || 'en',
            }));

          if (promptRows.length > 0) {
            const { error: promptError } = await supabase
              .from('prompts')
              .insert(promptRows);

            if (promptError) {
              console.error('Failed to create prompts:', promptError);
            }
          }
        }
      }
    }

    // Create competitors
    if (competitors && Array.isArray(competitors)) {
      const compRows = competitors.map((name: string) => ({
        brand_id: brand.id,
        competitor_name: name,
      }));

      if (compRows.length > 0) {
        const { error: compError } = await supabase
          .from('competitors')
          .insert(compRows);

        if (compError) {
          console.error('Failed to create competitors:', compError);
        }
      }
    }

    return NextResponse.json({
      success: true,
      brandId: brand.id,
      orgId,
    });
  } catch (error) {
    console.error('Save onboarding data failed:', error);
    return NextResponse.json(
      { error: 'Failed to save data. Please try again.' },
      { status: 500 }
    );
  }
}
