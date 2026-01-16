// Vercel Serverless Function to scrape Play Store
// Usage: GET /api/app?id=com.package.name

export default async function handler(request, response) {
  response.setHeader('Access-Control-Allow-Credentials', true);
  response.setHeader('Access-Control-Allow-Origin', '*'); 
  response.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  response.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  try {
    const host = request.headers.host || 'localhost';
    const protocol = request.headers['x-forwarded-proto'] || 'http';
    const { searchParams } = new URL(request.url, `${protocol}://${host}`);
    const appId = searchParams.get('id');

    if (!appId) {
      return response.status(400).json({ error: 'App ID is required' });
    }

    const playStoreUrl = `https://play.google.com/store/apps/details?id=${appId}&hl=ar`; 
    
    const res = await fetch(playStoreUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'ar,en-US;q=0.9,en;q=0.8'
      }
    });

    if (!res.ok) {
      console.warn(`Play Store returned status: ${res.status}`);
      return response.status(200).json({
        id: appId,
        iconUrl: "", 
        rating: 0,
        downloads: "",
        description: "",
        screenshots: [],
        playStoreUrl: playStoreUrl
      });
    }

    const html = await res.text();

    // --- Robust Regex Scrapers (Updated) ---
    
    // 1. Icon: Look for standard image prop or specific class names often used by GP
    let iconUrl = '';
    const iconRegex = /<img[^>]+src="([^"]+)"[^>]+(alt="Icon image"|class="T75aBb[^"]*"|itemprop="image")/i;
    const iconMatch = html.match(iconRegex);
    if (iconMatch) iconUrl = iconMatch[1];
    
    // 2. Rating
    let rating = 0;
    const ratingMatch = html.match(/aria-label="Rated ([0-9.]+)/i) || 
                        html.match(/"starRating":\s*([0-9.]+)/) ||
                        html.match(/<div[^>]+itemprop="starRating"[^>]*>.*?([0-9.]+).*?<\/div>/s);
    if (ratingMatch) rating = parseFloat(ratingMatch[1]);

    // 3. Downloads (Critical Fix)
    // Google Play format: "1M+" or "500K+" usually inside a specific div structure
    let downloads = '';
    // Pattern 1: JSON data in script
    // Pattern 2: Visible text
    const downloadMatch = html.match(/>\s*([0-9,.]+[K|M]\+)\s*downloads/i) ||
                          html.match(/<div>([0-9,.]+[K|M]\+)<\/div>/) ||
                          html.match(/"numDownloads":"([^"]+)"/); // Sometimes in JSON blobs

    if (downloadMatch) {
       downloads = downloadMatch[1].replace('downloads', '').trim();
    } else {
        // Fallback: Look for the text "Operations" or "Installations" in Arabic context if scraped in AR
        const arDownloadMatch = html.match(/>([0-9,.]+\+)\s*عملية تنزيل/);
        if (arDownloadMatch) downloads = arDownloadMatch[1];
    }

    // 4. Description
    let description = '';
    const descMatch = html.match(/data-g-id="description"[^>]*>(.*?)<\/div>/s) ||
                      html.match(/itemprop="description"[^>]*><div[^>]*>(.*?)<\/div><\/div>/s);
    if (descMatch) {
        description = descMatch[1]
            .replace(/<br>/g, '\n')
            .replace(/<[^>]+>/g, '') 
            .replace(/&quot;/g, '"')
            .replace(/&amp;/g, '&');
    }

    // 5. Screenshots
    const screenshots = [];
    const screenshotRegex = /<img[^>]+src="([^"]+)"[^>]+alt="Screenshot Image"/g;
    let match;
    while ((match = screenshotRegex.exec(html)) !== null) {
        if (!screenshots.includes(match[1]) && !match[1].includes('cp-anchor')) {
            screenshots.push(match[1]);
        }
    }

    const data = {
      id: appId,
      iconUrl: iconUrl || "", 
      rating: rating || 0,
      downloads: downloads, // May be empty if blocked, but regex is better now
      description: description.substring(0, 500) + (description.length > 500 ? '...' : ''),
      fullDescription: description,
      screenshots: screenshots.length > 0 ? screenshots : [],
      playStoreUrl: playStoreUrl
    };

    return response.status(200).json(data);

  } catch (error) {
    console.error('Scraping Error:', error);
    return response.status(200).json({ 
        id: request.query?.id || 'unknown',
        description: "",
        iconUrl: "",
        screenshots: []
    });
  }
}