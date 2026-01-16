
import { AppCategory, AppData } from './types';

// The base directory of apps. 
// Metadata (Images, Ratings, Desc) is fetched dynamically from /api/app based on the ID.

export const APPS_DATA: AppData[] = [
  // --- Xopoc Apps ---
  {
    id: 'com.xopoc.drpeterramsis.xopocpatcher',
    title: 'إشليل الاجبية المسموعة الشاملة',
    developer: 'Xopoc',
    category: AppCategory.HYMNS,
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.xopoc.drpeterramsis.xopocpatcher',
    featured: true
  },
  {
    id: 'com.xopoc.drpeterramsis.copticalhan.arabictasbeha_p',
    title: 'ابصالتوس تسبحة نصف الليل مسموع',
    developer: 'Xopoc',
    category: AppCategory.HYMNS,
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.xopoc.drpeterramsis.copticalhan.arabictasbeha_p',
    featured: true
  },
  {
    id: 'io.kodular.drpeterramsis2007.fm_masehy',
    title: 'اف ام مسيحي',
    developer: 'Xopoc',
    category: AppCategory.RADIO,
    playStoreUrl: 'https://play.google.com/store/apps/details?id=io.kodular.drpeterramsis2007.fm_masehy',
    featured: true
  },
  {
    id: 'com.xopoc.drpeterramsis.ekklesia',
    title: 'اكليسيا',
    developer: 'Xopoc',
    category: AppCategory.SERVICES,
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.xopoc.drpeterramsis.ekklesia'
  },
  {
    id: 'io.kodular.drpeterramsis2007.agpeya2',
    title: 'الاجبية المسموعة بدون انترنت',
    developer: 'Xopoc',
    category: AppCategory.HYMNS,
    playStoreUrl: 'https://play.google.com/store/apps/details?id=io.kodular.drpeterramsis2007.agpeya2',
    featured: true
  },
  {
    id: 'io.kodular.drpeterramsis2007.Turin_Shroud_App',
    title: 'الشاهد الصامت',
    developer: 'Xopoc',
    category: AppCategory.SERVICES,
    playStoreUrl: 'https://play.google.com/store/apps/details?id=io.kodular.drpeterramsis2007.Turin_Shroud_App'
  },
  {
    id: 'io.kodular.drpeterramsis2007.xopoc',
    title: 'الشبكة القبطية',
    developer: 'Xopoc',
    category: AppCategory.SERVICES,
    playStoreUrl: 'https://play.google.com/store/apps/details?id=io.kodular.drpeterramsis2007.xopoc'
  },
  {
    id: 'com.xopoc.drpeterramsis.copticalhan_tasbehacopticgad',
    title: 'الكتاب المقدس مسموع بدون نت',
    developer: 'Xopoc',
    category: AppCategory.BIBLE,
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.xopoc.drpeterramsis.copticalhan_tasbehacopticgad',
    featured: true
  },
  {
    id: 'io.kodular.drpeterramsis2007.Colored_Kholagy',
    title: 'خورس Xopoc',
    developer: 'Xopoc',
    // UPDATED: Changed from HYMNS to SERVICES as requested
    category: AppCategory.SERVICES, 
    playStoreUrl: 'https://play.google.com/store/apps/details?id=io.kodular.drpeterramsis2007.Colored_Kholagy',
    featured: true
  },
  {
    id: 'com.xopoc.drpeterramsis.old_fm_mase7y',
    title: 'راديو اف ام مسيحي - النسخة القديمة',
    developer: 'Xopoc',
    category: AppCategory.RADIO,
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.xopoc.drpeterramsis.old_fm_mase7y'
  },
  {
    id: 'com.xopoc.drpeterramsis.copticalhan_madehtamged',
    title: 'سحابة الشهود',
    developer: 'Xopoc',
    category: AppCategory.HYMNS,
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.xopoc.drpeterramsis.copticalhan_madehtamged'
  },
  {
    id: 'io.kodular.drpeterramsis2007.NewmazamerAudio',
    title: 'سفر المزامير مسموع بدون انترنت',
    developer: 'Xopoc',
    category: AppCategory.BIBLE,
    playStoreUrl: 'https://play.google.com/store/apps/details?id=io.kodular.drpeterramsis2007.NewmazamerAudio',
    featured: true
  },
  {
    id: 'appinventor.ai_drpeterramsis2007.Passion_alhan',
    title: 'سوتيريا',
    developer: 'Xopoc',
    category: AppCategory.HYMNS,
    playStoreUrl: 'https://play.google.com/store/apps/details?id=appinventor.ai_drpeterramsis2007.Passion_alhan'
  },
  {
    id: 'io.kodular.drpeterramsis2007.Arshy_Angelos',
    title: 'مردات والحان الشماس',
    developer: 'Xopoc',
    category: AppCategory.HYMNS,
    playStoreUrl: 'https://play.google.com/store/apps/details?id=io.kodular.drpeterramsis2007.Arshy_Angelos'
  },
  {
    id: 'appinventor.ai_drpeterramsis2007.CONFESSION',
    title: 'ميطانيا ◄دليل التوبة والاعتراف',
    developer: 'Xopoc',
    category: AppCategory.SERVICES,
    playStoreUrl: 'https://play.google.com/store/apps/details?id=appinventor.ai_drpeterramsis2007.CONFESSION'
  },
  {
    id: 'com.xopoc.peterramsis.psalmody',
    title: 'ني أنجيلوس',
    developer: 'Xopoc',
    category: AppCategory.HYMNS,
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.xopoc.peterramsis.psalmody'
  },

  // --- Sp Bread Apps ---
  {
    id: 'com.xopoc.drpeterramsis.spiritbread.oldbible_soliman',
    title: 'اسفار سليمان',
    developer: 'Sp Bread',
    category: AppCategory.BIBLE,
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.xopoc.drpeterramsis.spiritbread.oldbible_soliman'
  },
  {
    id: 'com.xopoc.drpeterramsis.spiritbread.actsrestdrama',
    title: 'اعمال الرسل والرسائل',
    developer: 'Sp Bread',
    category: AppCategory.BIBLE,
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.xopoc.drpeterramsis.spiritbread.actsrestdrama'
  },
  {
    id: 'com.xopoc.drpeterramsis.spiritbread.actsrestread',
    title: 'اعمال الرسل والرسائل - دراما',
    developer: 'Sp Bread',
    category: AppCategory.BIBLE,
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.xopoc.drpeterramsis.spiritbread.actsrestread'
  },
  {
    id: 'appinventor.ai_drpeterramsis2007.B_Numbers_App',
    title: 'الاسفارالقانونية الثانية مسموع',
    developer: 'Sp Bread',
    category: AppCategory.BIBLE,
    playStoreUrl: 'https://play.google.com/store/apps/details?id=appinventor.ai_drpeterramsis2007.B_Numbers_App'
  },
  {
    id: 'com.xopoc.drpeterramsis.spiritbread.gospelsalhanfathereshak',
    title: 'البشائر الأربعة - ابونا اسحاق',
    developer: 'Sp Bread',
    category: AppCategory.BIBLE,
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.xopoc.drpeterramsis.spiritbread.gospelsalhanfathereshak'
  },
  {
    id: 'com.xopoc.drpeterramsis.spiritbread.gospelsdrama',
    title: 'البشائر الأربعة دراما بدون نت',
    developer: 'Sp Bread',
    category: AppCategory.BIBLE,
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.xopoc.drpeterramsis.spiritbread.gospelsdrama'
  },
  {
    id: 'com.xopoc.drpeterramsis.spiritbread.gospelsread',
    title: 'البشائر الأربعة مسموعة بدون نت',
    developer: 'Sp Bread',
    category: AppCategory.BIBLE,
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.xopoc.drpeterramsis.spiritbread.gospelsread'
  },
  {
    id: 'com.xopoc.drpeterramsis.spiritbread.gospelsalhanibrahem',
    title: 'البشائر الأربعة ملحنه بدون نت',
    developer: 'Sp Bread',
    category: AppCategory.BIBLE,
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.xopoc.drpeterramsis.spiritbread.gospelsalhanibrahem'
  },
  {
    id: 'com.xopoc.drpeterramsis.spiritbread.oldbible_part1_d',
    title: 'العهد القديم الجزء الاول دراما',
    developer: 'Sp Bread',
    category: AppCategory.BIBLE,
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.xopoc.drpeterramsis.spiritbread.oldbible_part1_d'
  },
  {
    id: 'com.xopoc.drpeterramsis.spiritbread.oldbible_part1',
    title: 'العهد القديم الجزء الاول مسموع',
    developer: 'Sp Bread',
    category: AppCategory.BIBLE,
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.xopoc.drpeterramsis.spiritbread.oldbible_part1'
  },
  {
    id: 'com.xopoc.drpeterramsis.spiritbread.oldbible_part3_d',
    title: 'العهد القديم جزء ثالث دراما',
    developer: 'Sp Bread',
    category: AppCategory.BIBLE,
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.xopoc.drpeterramsis.spiritbread.oldbible_part3_d'
  },
  {
    id: 'com.xopoc.drpeterramsis.spiritbread.oldbible_part3',
    title: 'العهد القديم جزء ثالث مسموع',
    developer: 'Sp Bread',
    category: AppCategory.BIBLE,
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.xopoc.drpeterramsis.spiritbread.oldbible_part3'
  },
  {
    id: 'com.xopoc.drpeterramsis.spiritbread.oldbible_part2_d',
    title: 'العهد القديم جزء ثاني دراما',
    developer: 'Sp Bread',
    category: AppCategory.BIBLE,
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.xopoc.drpeterramsis.spiritbread.oldbible_part2_d'
  },
  {
    id: 'com.xopoc.drpeterramsis.spiritbread.oldbible_part2',
    title: 'العهد القديم جزء ثاني مسموع',
    developer: 'Sp Bread',
    category: AppCategory.BIBLE,
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.xopoc.drpeterramsis.spiritbread.oldbible_part2'
  },
  {
    id: 'com.xopoc.drpeterramsis.spiritbread.oldbible_part4_d',
    title: 'العهد القديم جزء رابع دراما',
    developer: 'Sp Bread',
    category: AppCategory.BIBLE,
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.xopoc.drpeterramsis.spiritbread.oldbible_part4_d'
  },
  {
    id: 'com.xopoc.drpeterramsis.spiritbread.oldbible_part4',
    title: 'العهد القديم جزء رابع مسموع',
    developer: 'Sp Bread',
    category: AppCategory.BIBLE,
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.xopoc.drpeterramsis.spiritbread.oldbible_part4'
  },
  {
    id: 'com.xopoc.drpeterramsis.spiritbread.revalutionbook',
    title: 'سفر الرؤيا مسموع بدون نت',
    developer: 'Sp Bread',
    category: AppCategory.BIBLE,
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.xopoc.drpeterramsis.spiritbread.revalutionbook'
  },
  {
    id: 'com.xopoc.drpeterramsis.spiritbread.lukejohn',
    title: 'غذاء الروح - لوقا ويوحنا',
    developer: 'Sp Bread',
    category: AppCategory.BIBLE,
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.xopoc.drpeterramsis.spiritbread.lukejohn'
  },
  {
    id: 'com.xopoc.drpeterramsis.spiritbread.mathewmark',
    title: 'غذاء الروح - متى ومرقس',
    developer: 'Sp Bread',
    category: AppCategory.BIBLE,
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.xopoc.drpeterramsis.spiritbread.mathewmark'
  }
];
