
# Xopoc App Store

The official app store for Xopoc Coptic applications.

## Version History

### v2.2.7
- **Compatibility Update**: Renamed "Direct Download" button to "**تحميل خاص بالاجهزة القديمة**" (Special download for old devices) to explicitly warn users that the APK is intended for Android 6/7.
- **UI Enhancements**:
    - **RTL Alignment**: Enforced Right-to-Left text alignment across the application components (Hero, Details) for better Arabic language support.
    - **Hero Descriptions**: Improved logic to prevent the App Title from appearing redundantly at the start of the description in the featured slider.
- **Code Quality**: Added regex escaping for safer string manipulation when cleaning descriptions.

### v2.2.6
- **Direct Download**: Added "Direct Download (APK)" feature for select apps, allowing users to download the application package directly from Dropbox servers without navigating to Google Play.
- **Hero Update**: Integrated Direct Download buttons into the Hero slider for featured apps that support this feature.
- **Apps Updated**: Enabled direct downloads for apps: Absaltos, Eshlil, Agpeya Audio, Psalms, Bible Audio, Deacon Hymns, Soteria, Metanoia, and Xopoc Khoros.

### v2.2.5
- **UI Fix (Contrast)**: Added smart text color adjustment for the "Download" button in App Details.
    - Uses YIQ color space formula to detect if the app's dominant theme color is light or dark.
    - Switches text color to Black for light backgrounds and White for dark backgrounds to ensure readability.
- **Scraper Fix**: 
    - Updated regex for **Total Downloads** and **Reviews Count** to support new Google Play Store HTML layouts where labels are separated from numbers by tags.
    - Added fallback search for JSON data patterns (e.g., `["10K+"]`) if HTML extraction fails.

### v2.2.4
- **Scraper Enhancements**: 
    - Added robust fetching for **Total Installs**, **Update Date**, **Latest Version**, **Highest Rating**, and **Total Reviews**.
    - Improved regex patterns to handle various Google Play Store HTML structures (Arabic/English).
- **Hero UX**:
    - **One-Line Description**: Strictly enforces a single-line summary for the app description in the Hero section.
    - **Smart Cleaning**: Removes the app title from the description to prevent redundancy.
- **Webapp Conversion**: Added `manifest.json` and theme colors to support PWA installation.

### v2.2.3
- **Featured Apps**: Now displays featured apps in a random order every time the site is opened to give exposure to all apps.
- **Hero UX**: 
    - Reordered Mobile layout: Icon (Top) -> Name -> Description -> Stats -> Button.
    - Improved Description Summary: Automatically removes the app title from the description text.
    - Added Stats: Now displays Total Downloads and Review counts in the Hero section alongside the rating.
- **Stats Integration**: Ensured Installs, Version, and Review counts are fetched and displayed prominently.

### v2.2.2
- **Logo Update**: Replaced generic "X" text logo with brand image (`logo.webp`).
- **UI Update**: Moved tagline to footer for better spacing.
- **Theme Update**: Changed Hero section primary color from Green to Blue (Secondary Brand Color).
- **Data Correction**: Moved "Xopoc Khoros" app to "Services" category.

### v2.2.1
- **Critical Fix**: Updated Play Store scraping logic (regex) to handle recent Google Play layout changes, improving fetching of Rating, Downloads, and Version info.
- **UX Improvement**: Clicking the Featured App card in the Hero section now opens the internal details page.
- **UI Tweaks**: Smart description summary in Hero section to avoid repeating the App Title.
- **Deploy**: Added configuration for easier GitHub Pages deployment.

### v2.2.0
- **Theme Update**: Changed global color scheme to Xopoc Red and Blue to match the brand identity.
- **Dynamic Theming**: Individual app pages now dynamically adapt their color scheme based on the app icon's dominant color.
- **New Metadata**: Added display for App Version, Last Updated Date, and Total Reviews count.
- **Scroll to Top**: Added a floating button to easily scroll back to the top of the page.
- **Scraper Upgrade**: Improved `api/app.js` to parse localized Arabic data from Google Play for version and dates.

### v2.1.0
- **Arabic Localization**: Full translation of the interface to Arabic.
- **App Categorization**: Separated "Spirit Bread" apps from main Xopoc apps.
- **UI Improvements**: Added animated Hero section and cleaner card design.

### v1.0.0
- Initial Release.