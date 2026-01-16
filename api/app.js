
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

    // Force Arabic locale to match regex
    const playStoreUrl = `https://play.google.com/store/apps/details?id=${appId}&hl=ar&gl=EG`; 
    
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

    // --- Robust Regex Scrapers (Updated v2.2.1) ---
    
    // 1. Icon
    let iconUrl = '';
    const iconRegex = /<img[^>]+src="([^"]+)"[^>]+(alt="Icon image"|class="T75aBb[^"]*"|itemprop="image")/i;
    const iconMatch = html.match(iconRegex);
    if (iconMatch) iconUrl = iconMatch[1];
    
    // 2. Rating
    // Strategies: 
    // A) Look for aria-label on the star rating div (e.g. "Rated 4.5 stars out of five stars")
    // B) Look for "starRating" structured data
    // C) Look for text content inside specific rating classes
    let rating = 0;
    
    // Strategy A (Arabic/English agnostic regex for number followed by star/rating keyword)
    const ratingAria = html.match(/aria-label="[^"]*([0-5]\.[0-9])[^"]*(\u0646\u062c\u0648\u0645|stars)/i);
    
    // Strategy B (JSON-LD)
    const ratingJson = html.match(/"starRating":\s*{\s*"?@type"?:\s*"Rating",\s*"?ratingValue"?:\s*"([0-9.]+)"/);
    
    // Strategy C (Fallback text)
    const ratingText = html.match(/>([0-9]\.[0-9])<.*star/i);

    if (ratingJson) {
        rating = parseFloat(ratingJson[1]);
    } else if (ratingAria) {
        rating = parseFloat(ratingAria[1]);
    } else if (ratingText) {
        rating = parseFloat(ratingText[1]);
    }

    // 3. Downloads
    // Look for "10K+" or "1,000+" followed by downloads/عملية تنزيل
    let downloads = '';
    
    // Try to find the exact text in a div
    const downloadRegex = />\s*([0-9,.]+[K|M|B]?\+)\s*(downloads|عملية تنزيل)/i;
    const downloadMatch = html.match(downloadRegex);
    
    if (downloadMatch) {
       downloads = downloadMatch[1].trim();
    } else {
        // Fallback: look for script data ["10K+"]
        const scriptDownload = html.match(/\["([0-9,.]+[K|M]?\+)"\]/);
        if (scriptDownload) downloads = scriptDownload[1];
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
    const screenshotRegex = /<img[^>]+src="([^"]+)"[^>]+alt="(Screenshot Image|صورة لقطة الشاشة)"/g;
    let match;
    while ((match = screenshotRegex.exec(html)) !== null) {
        if (!screenshots.includes(match[1]) && !match[1].includes('cp-anchor')) {
            screenshots.push(match[1]);
        }
    }

    // 6. Reviews Count
    // Arabic: 1.25 ألف مراجعة or 500 مراجعة
    // English: 1.25K reviews
    let reviewsCount = '';
    const reviewsMatch = html.match(/>([0-9,.]+\s*[K|M|ألف|مليون]?)\s*(reviews|مراجعة)</i);
    if (reviewsMatch) reviewsCount = reviewsMatch[1];

    // 7. Last Updated
    // Find text "Updated on" or "تاريخ التحديث" then find the next div content
    let updatedOn = '';
    const updateRegex = />(تاريخ التحديث|Updated on)<\/div>.*?<div[^>]*>(.*?)<\/div>/s;
    const updateMatch = html.match(updateRegex);
    if (updateMatch) {
        updatedOn = updateMatch[2].replace(/<[^>]+>/g, '').trim();
    }

    // 8. Version
    let version = '';
    // Find "Current Version" or "الإصدار الحالي"
    const versionRegex = />(الإصدار الحالي|Current Version)<\/div>.*?<div[^>]*>(.*?)<\/div>/s;
    const versionMatch = html.match(versionRegex);
    if (versionMatch) {
        version = versionMatch[2].replace(/<[^>]+>/g, '').trim();
    }

    const data = {
      id: appId,
      iconUrl: iconUrl || "", 
      rating: rating || 0,
      downloads: downloads, 
      description: description.substring(0, 500) + (description.length > 500 ? '...' : ''),
      fullDescription: description,
      screenshots: screenshots.length > 0 ? screenshots : [],
      reviewsCount: reviewsCount || '',
      updatedOn: updatedOn || '',
      version: version || '',
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
