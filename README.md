
# Xopoc App Store

The official app store for Xopoc Coptic applications.

## Version History

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
