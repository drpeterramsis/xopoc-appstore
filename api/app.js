// Vercel Serverless Function to scrape Play Store
// Usage: GET /api/app?id=com.package.name

export default async function handler(request, response) {
  // 1. Handle CORS (Critical for Google Sites embedding)
  response.setHeader('Access-Control-Allow-Credentials', true);
  response.setHeader('Access-Control-Allow-Origin', '*'); // In production, you might restrict this to your Google Sites domain
  response.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  response.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle Preflight OPTIONS request
  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  try {
    // Robust URL parsing that handles missing host header
    const host = request.headers.host || 'localhost';
    const protocol = request.headers['x-forwarded-proto'] || 'http';
    const { searchParams } = new URL(request.url, `${protocol}://${host}`);
    const appId = searchParams.get('id');

    if (!appId) {
      return response.status(400).json({ error: 'App ID is required' });
    }

    const playStoreUrl = `https://play.google.com/store/apps/details?id=${appId}&hl=ar`; // Scrape Arabic version
    
    // Updated User-Agent to look like a modern browser to reduce 403 blocks
    const res = await fetch(playStoreUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    // Handle non-200 responses from Google (e.g., 404 if app doesn't exist, or 403 if blocked)
    if (!res.ok) {
      console.warn(`Play Store returned status: ${res.status}`);
      // Return partial data so the frontend doesn't break
      return response.status(200).json({
        id: appId,
        iconUrl: "", 
        rating: 0,
        downloads: "",
        description: "App details unavailable.",
        screenshots: [],
        playStoreUrl: playStoreUrl
      });
    }

    const html = await res.text();

    // --- Robust Regex Scrapers ---
    
    // 1. Icon
    let iconUrl = '';
    const iconMatch = html.match(/<img[^>]+src="([^"]+)"[^>]+alt="Icon image"/i) || 
                      html.match(/<img[^>]+src="([^"]+)"[^>]+itemprop="image"/i) ||
                      html.match(/<img[^>]+src="([^"]+)"[^>]+class="T75aBb[^"]*"/); // Common class for icons
    if (iconMatch) iconUrl = iconMatch[1];
    
    // 2. Rating
    let rating = 0;
    const ratingMatch = html.match(/aria-label="Rated ([0-9.]+)/i) || 
                        html.match(/<div[^>]+itemprop="starRating"[^>]*>.*?<div[^>]+>([0-9.]+)/s);
    if (ratingMatch) rating = parseFloat(ratingMatch[1]);

    // 3. Downloads
    let downloads = '';
    // Look for the specific structure often found in stats
    const downloadMatch = html.match(/>([0-9,]+[K|M]\+)\s*downloads/i) ||
                          html.match(/<div>([0-9,]+[K|M]\+)<\/div>/);
    if (downloadMatch) downloads = downloadMatch[1];

    // 4. Description
    let description = '';
    const descMatch = html.match(/itemprop="description"[^>]*><div[^>]*>(.*?)<\/div><\/div>/s) ||
                      html.match(/data-g-id="description"[^>]*>(.*?)<\/div>/s);
    if (descMatch) {
        description = descMatch[1]
            .replace(/<br>/g, '\n')
            .replace(/<[^>]+>/g, '') // Strip HTML tags
            .replace(/&quot;/g, '"')
            .replace(/&amp;/g, '&');
    }

    // 5. Screenshots
    const screenshots = [];
    const screenshotRegex = /<img[^>]+src="([^"]+)"[^>]+alt="Screenshot Image"/g;
    let match;
    while ((match = screenshotRegex.exec(html)) !== null) {
        // Prevent duplicates and small thumbnails
        if (!screenshots.includes(match[1]) && !match[1].includes('cp-anchor')) {
            screenshots.push(match[1]);
        }
    }

    // Return Data
    const data = {
      id: appId,
      iconUrl: iconUrl || "", 
      rating: rating || 0,
      downloads: downloads,
      description: description.substring(0, 500) + (description.length > 500 ? '...' : ''),
      fullDescription: description,
      screenshots: screenshots.length > 0 ? screenshots : [],
      playStoreUrl: playStoreUrl
    };

    return response.status(200).json(data);

  } catch (error) {
    console.error('Scraping Error:', error);
    // Return a 200 with minimal data so the UI doesn't crash on network/parsing errors
    return response.status(200).json({ 
        id: request.query?.id || 'unknown',
        description: "Could not fetch details.",
        iconUrl: "",
        screenshots: []
    });
  }
}