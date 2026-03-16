import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
  try {
    const { brandName, brandUrl, market, language, topics, competitors } = await req.json();

    if (!brandName || !brandUrl) {
      return NextResponse.json({ error: 'Brand name and URL required' }, { status: 400 });
    }

    // Use service role client to bypass RLS (no auth during onboarding)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Create a temporary org for unauthenticated onboarding
    // In production, this would be tied to the user's auth session
    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .insert({
        name: brandName,
        plan: 'free',
        // Use a placeholder UUID for unauthenticated users
        owner_user_id: '00000000-0000-0000-0000-000000000000',
      })
      .select()
      .single();

    if (orgError) {
      console.error('Failed to create org:', orgError);
      return NextResponse.json({ error: 'Failed to save brand data' }, { status: 500 });
    }

    // Create brand
    const { data: brand, error: brandError } = await supabase
      .from('brands')
      .insert({
        org_id: org.id,
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
    const topicMap: Record<string, string> = {};
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

        topicMap[topic.name] = dbTopic.id;

        // Insert prompts for this topic
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
      orgId: org.id,
    });
  } catch (error) {
    console.error('Save onboarding data failed:', error);
    return NextResponse.json(
      { error: 'Failed to save data. Please try again.' },
      { status: 500 }
    );
  }
}
