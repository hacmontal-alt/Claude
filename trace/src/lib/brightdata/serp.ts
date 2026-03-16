/**
 * Bright Data SERP API integration
 * Docs: https://docs.brightdata.com/scraping-automation/serp-api/introduction
 *
 * Uses the direct API method: POST https://api.brightdata.com/request
 * Requires BRIGHTDATA_API_TOKEN and BRIGHTDATA_SERP_ZONE env vars.
 */

export interface BrightDataSerpResult {
  aiOverview: string | null;
  aiOverviewSources: { url: string; title: string }[];
  organicResults: { title: string; url: string; snippet: string; position: number }[];
  relatedSearches: string[];
}

export async function queryGoogleSerp(
  query: string,
  options: { country?: string; language?: string; aiOverview?: boolean } = {}
): Promise<BrightDataSerpResult> {
  const apiToken = process.env.BRIGHTDATA_API_TOKEN;
  const zone = process.env.BRIGHTDATA_SERP_ZONE || 'serp_api1';

  if (!apiToken) {
    throw new Error('BRIGHTDATA_API_TOKEN is not set');
  }

  const { country = 'us', language = 'en', aiOverview = true } = options;

  // Build the Google search URL with Bright Data parameters
  const searchParams = new URLSearchParams({
    q: query,
    gl: country,
    hl: language,
    brd_json: '1',
  });

  if (aiOverview) {
    searchParams.set('brd_ai_overview', '2');
  }

  const googleUrl = `https://www.google.com/search?${searchParams.toString()}`;

  const response = await fetch('https://api.brightdata.com/request', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiToken}`,
    },
    body: JSON.stringify({
      zone,
      url: googleUrl,
      format: 'json',
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Bright Data SERP API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();

  return parseSerpResponse(data);
}

function parseSerpResponse(data: any): BrightDataSerpResult {
  const result: BrightDataSerpResult = {
    aiOverview: null,
    aiOverviewSources: [],
    organicResults: [],
    relatedSearches: [],
  };

  // Parse AI Overview
  if (data.ai_overview) {
    const aio = data.ai_overview;
    result.aiOverview = typeof aio === 'string'
      ? aio
      : aio.text || aio.snippet || aio.content || JSON.stringify(aio);

    // Parse AI Overview sources/references
    const sources = aio.sources || aio.references || aio.citations || [];
    for (const source of sources) {
      const url = source.link || source.url || '';
      const title = source.title || source.name || '';
      if (url) {
        result.aiOverviewSources.push({ url, title });
      }
    }
  }

  // Parse organic results
  const organic = data.organic || data.organic_results || [];
  for (const item of organic) {
    result.organicResults.push({
      title: item.title || '',
      url: item.link || item.url || '',
      snippet: item.snippet || item.description || '',
      position: item.position || 0,
    });
  }

  // Parse related searches
  const related = data.related_searches || data.related_queries || [];
  for (const item of related) {
    const query = typeof item === 'string' ? item : item.query || item.text || '';
    if (query) {
      result.relatedSearches.push(query);
    }
  }

  return result;
}
