// Vercel Serverless Function to scrape Play Store
// Usage: GET /api/app?id=com.package.name

export default async function handler(request, response) {
  const { searchParams } = new URL(request.url);
  const appId = searchParams.get('id');

  if (!appId) {
    return response.status(400).json({ error: 'App ID is required' });
  }

  try {
    const playStoreUrl = `https://play.google.com/store/apps/details?id=${appId}&hl=ar`; // Scrape Arabic version
    const res = await fetch(playStoreUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch Play Store page: ${res.status}`);
    }

    const html = await res.text();

    // --- Robust Regex Scrapers ---
    // Note: Play Store HTML structure changes, but these patterns target relatively stable meta tags and standard attributes.

    // 1. Icon (Look for Open Graph image or specific img class)
    // Try OG Image first (usually feature graphic, but sometimes icon), then fallback to specific img patterns
    let iconUrl = '';
    const iconMatch = html.match(/<img[^>]+src="([^"]+)"[^>]+alt="Icon image"/i) || 
                      html.match(/<img[^>]+src="([^"]+)"[^>]+itemprop="image"/i);
    if (iconMatch) iconUrl = iconMatch[1];
    
    // 2. Rating (Look for aria-label or specific class)
    // Example: "Rated 4.8 stars out of five"
    let rating = 0;
    const ratingMatch = html.match(/aria-label="Rated ([0-9.]+)/i) || 
                        html.match(/<div>([0-9]\.[0-9])<star-rating/); // hypothetical fallback
    if (ratingMatch) rating = parseFloat(ratingMatch[1]);

    // 3. Downloads (e.g., "100K+")
    // Often in a specific div: <div>100K+</div> followed by "Downloads"
    let downloads = 'N/A';
    // This regex looks for a number followed by +, K, M inside a div, roughly corresponding to stats area
    const downloadMatch = html.match(/>([0-9,]+[K|M]\+)</); 
    if (downloadMatch) downloads = downloadMatch[1];

    // 4. Description
    // itemprop="description" is standard
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
    // Look for images with alt="Screenshot Image"
    const screenshots = [];
    const screenshotRegex = /<img[^>]+src="([^"]+)"[^>]+alt="Screenshot Image"/g;
    let match;
    while ((match = screenshotRegex.exec(html)) !== null) {
        // Prevent duplicates and thumbnails if possible
        if (!screenshots.includes(match[1]) && !match[1].includes('cp-anchor')) {
            screenshots.push(match[1]);
        }
    }

    // Return Data
    const data = {
      id: appId,
      iconUrl: iconUrl || "https://placehold.co/512x512/202124/0F9D58?text=No+Icon",
      rating: rating || 0,
      downloads: downloads,
      description: description.substring(0, 500) + (description.length > 500 ? '...' : ''), // Truncate for preview
      fullDescription: description,
      screenshots: screenshots.length > 0 ? screenshots : [],
      playStoreUrl: playStoreUrl
    };

    return response.status(200).json(data);

  } catch (error) {
    console.error('Scraping Error:', error);
    return response.status(500).json({ error: 'Failed to scrape data', details: error.message });
  }
}