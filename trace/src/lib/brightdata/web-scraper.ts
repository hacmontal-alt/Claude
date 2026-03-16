/**
 * Bright Data Web Unlocker API for scraping web pages.
 * Used to fetch content from brand websites, competitor pages, and cited sources.
 */

export interface ScrapedPage {
  url: string;
  title: string;
  description: string;
  bodyText: string;
  headings: string[];
}

export async function scrapePage(url: string): Promise<ScrapedPage> {
  const apiToken = process.env.BRIGHTDATA_API_TOKEN;
  const zone = process.env.BRIGHTDATA_WEB_ZONE || 'web_unlocker1';

  if (!apiToken) {
    throw new Error('BRIGHTDATA_API_TOKEN is not set');
  }

  const response = await fetch('https://api.brightdata.com/request', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiToken}`,
    },
    body: JSON.stringify({
      zone,
      url,
      format: 'raw',
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Bright Data Web Unlocker error (${response.status}): ${errorText}`);
  }

  const html = await response.text();
  return parseHtml(url, html);
}

function parseHtml(url: string, html: string): ScrapedPage {
  // Extract title
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim().replace(/\s+/g, ' ') : '';

  // Extract meta description
  const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([\s\S]*?)["']/i)
    || html.match(/<meta[^>]*content=["']([\s\S]*?)["'][^>]*name=["']description["']/i);
  const description = descMatch ? descMatch[1].trim() : '';

  // Extract headings
  const headings: string[] = [];
  const headingRegex = /<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/gi;
  let match;
  while ((match = headingRegex.exec(html)) !== null) {
    const text = match[1].replace(/<[^>]+>/g, '').trim();
    if (text) headings.push(text);
  }

  // Extract body text (strip tags, scripts, styles)
  let bodyText = html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<nav[\s\S]*?<\/nav>/gi, '')
    .replace(/<footer[\s\S]*?<\/footer>/gi, '')
    .replace(/<header[\s\S]*?<\/header>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // Limit body text to a reasonable size
  if (bodyText.length > 5000) {
    bodyText = bodyText.slice(0, 5000);
  }

  return { url, title, description, bodyText, headings };
}
