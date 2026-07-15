import type { Locale } from '@/types';

/**
 * Lightweight i18n dictionary. UI chrome only — quest content (titles,
 * descriptions) comes from Airtable and is not translated here.
 * Interpolate with {name} placeholders; pass values via the `vars` arg.
 */
export const translations = {
  en: {
    'nav.admin': 'Admin',
    'nav.backToVault': '← Back to Vault',

    'about.whatTitle': 'What are Quests?',
    'about.whatBody':
      'Quests are short-term, production-grade challenges designed to simulate real-world industry tasks. Instead of following rigid tutorials, you are given a business problem and the freedom to explore, choose your own tools, and architect your own solution.',
    'about.whyTitle': 'Why participate?',

    'why.feedbackLead': 'Get Personalized Pro Feedback:',
    'why.feedbackBody':
      'Every submission receives actionable code and architectural review from industry experts, showing you exactly where you excelled and how to improve.',
    'why.portfolioLead': 'Build a Standout Portfolio:',
    'why.portfolioBody':
      'Move beyond generic tutorials and build unique, end-to-end projects that prove your problem-solving skills to tech recruiters.',
    'why.spotlightLead': 'Earn the Spotlight:',
    'why.spotlightBefore': 'Top performers from each Quest are featured in our ',
    'why.spotlightLink': 'LinkedIn Spotlight',
    'why.spotlightAfter':
      ', gaining direct visibility and exposure to hiring managers and tech companies.',

    'filter.all': 'All',
    'filter.searchPlaceholder': 'Search quests…',
    'filter.clearSearch': 'Clear search',

    'status.active': 'Active',
    'status.pending': 'Pending',
    'status.completed': 'Completed',
    'status.draft': 'Draft',
    'status.archived': 'Archived',

    'table.id': 'ID',
    'table.title': 'Title',
    'table.status': 'Status',
    'table.start': 'Start',
    'table.end': 'End',
    'table.description': 'Description',
    'table.details': 'Details',
    'table.submission': 'Submission',
    'table.view': 'View',

    'action.submit': 'Submit',
    'action.lateSubmission': 'Late Submission',
    'card.moreDetails': 'More details',

    'drawer.register': 'Register to the quest',
    'drawer.details': 'What you need to know?',
    'drawer.close': 'Close quest panel',
    'hint.lateSubmission':
      'Oh, you missed the date of this quest, however, you can still complete the quest and submit it to get a personal feedback.',

    'empty.title': 'No quests found',
    'empty.filter': 'No quests match the current filter.',
    'empty.search': 'No results for “{query}”',
    'error.loadTitle': 'Failed to load quests',
    'error.loadBody': 'Check your Airtable configuration and try again.',
    'pagination.info': 'Page {page} of {totalPages} · {total} total',

    'ticker.submit': 'Submit {title} - click here for details',
    'ticker.comingSoon': '{title} is coming soon',
  },
  he: {
    'nav.admin': 'ניהול',
    'nav.backToVault': '← חזרה למאגר',

    'about.whatTitle': 'מה הן משימות (Quests)?',
    'about.whatBody':
      'משימות הן אתגרים קצרי-טווח ברמת פרודקשן, שנועדו לדמות מטלות אמיתיות מהתעשייה. במקום ללכת אחרי מדריכים נוקשים, אתם מקבלים בעיה עסקית וחופש לחקור, לבחור את הכלים שלכם ולתכנן בעצמכם את הפתרון.',
    'about.whyTitle': 'למה להשתתף?',

    'why.feedbackLead': 'קבלו משוב מקצועי ואישי:',
    'why.feedbackBody':
      'כל הגשה מקבלת סקירת קוד וארכיטקטורה מעשית ממומחים מהתעשייה, שמראה לכם בדיוק היכן הצטיינתם וכיצד להשתפר.',
    'why.portfolioLead': 'בנו תיק עבודות בולט:',
    'why.portfolioBody':
      'צאו מעבר למדריכים גנריים ובנו פרויקטים ייחודיים מקצה לקצה, שמוכיחים את יכולת פתרון הבעיות שלכם למגייסים בתעשייה.',
    'why.spotlightLead': 'זכו בזרקור:',
    'why.spotlightBefore': 'המצטיינים מכל משימה מוצגים ב',
    'why.spotlightLink': 'זרקור הלינקדאין שלנו',
    'why.spotlightAfter': ', וזוכים לחשיפה ישירה למנהלי גיוס ולחברות טכנולוגיה.',

    'filter.all': 'הכול',
    'filter.searchPlaceholder': 'חיפוש משימות…',
    'filter.clearSearch': 'ניקוי חיפוש',

    'status.active': 'פעילה',
    'status.pending': 'ממתינה',
    'status.completed': 'הושלמה',
    'status.draft': 'טיוטה',
    'status.archived': 'בארכיון',

    'table.id': 'מס׳',
    'table.title': 'כותרת',
    'table.status': 'סטטוס',
    'table.start': 'התחלה',
    'table.end': 'סיום',
    'table.description': 'תיאור',
    'table.details': 'פרטים',
    'table.submission': 'הגשה',
    'table.view': 'צפייה',

    'action.submit': 'הגשה',
    'action.lateSubmission': 'הגשה מאוחרת',
    'card.moreDetails': 'פרטים נוספים',

    'drawer.register': 'הרשמה למשימה',
    'drawer.details': 'מה חשוב לדעת?',
    'drawer.close': 'סגירת חלון המשימה',
    'hint.lateSubmission':
      'אופס, פספסתם את מועד המשימה — אך עדיין אפשר להשלים אותה ולהגיש כדי לקבל משוב אישי.',

    'empty.title': 'לא נמצאו משימות',
    'empty.filter': 'אין משימות שתואמות את הסינון הנוכחי.',
    'empty.search': 'אין תוצאות עבור “{query}”',
    'error.loadTitle': 'טעינת המשימות נכשלה',
    'error.loadBody': 'בדקו את הגדרות ה-Airtable ונסו שוב.',
    'pagination.info': 'עמוד {page} מתוך {totalPages} · {total} סה״כ',

    'ticker.submit': 'הגישו את {title} - לחצו כאן לפרטים',
    'ticker.comingSoon': '{title} בקרוב',
  },
} as const;

export type TranslationKey = keyof (typeof translations)['en'];

export function hasTranslation(key: string): key is TranslationKey {
  return key in translations.en;
}

export function translate(
  locale: Locale,
  key: TranslationKey,
  vars?: Record<string, string | number>
): string {
  const dict = translations[locale] ?? translations.en;
  let str: string = dict[key] ?? translations.en[key] ?? key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
    }
  }
  return str;
}
