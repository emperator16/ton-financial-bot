require('dotenv').config();

const { Telegraf, Markup } = require('telegraf');
const express = require('express');

const bot = new Telegraf(process.env.BOT_TOKEN);
const app = express();


// ============================================================
// CONFIG
// ============================================================

const ADMIN_ID = process.env.ADMIN_ID;
const SUPPORT_USERNAME = process.env.SUPPORT_USERNAME || 'Ego_senshi';


// ============================================================
// USER DATA
// ============================================================

const users = {};


// ============================================================
// PERFORMANCE
// این اعداد را با آمار واقعی خودت جایگزین کن
// ============================================================

const PERFORMANCE = {
  period: '3 ماه اخیر',
  totalForms: 84,
  wins: 61,
  losses: 23,
  winRate: '72.6%'
};


// ============================================================
// UTILITIES
// ============================================================

function getUser(ctx) {
  const id = ctx.from.id;

  if (!users[id]) {
    users[id] = {
      step: 'start',
      views: {},
      startedAt: new Date().toISOString()
    };
  }

  return users[id];
}


function trackView(ctx, section) {
  const user = getUser(ctx);

  if (!user.views) {
    user.views = {};
  }

  user.views[section] =
    (user.views[section] || 0) + 1;
}


function supportUrl(text) {
  return `https://t.me/${SUPPORT_USERNAME}?text=${encodeURIComponent(text)}`;
}


// ============================================================
// MAIN MENU
// ============================================================

function mainMenu() {
  return Markup.inlineKeyboard([
    [
      Markup.button.callback(
        '🎁 دریافت فرم تستی',
        'free_pick'
      ),
      Markup.button.callback(
        '👑 اشتراک VIP',
        'vip'
      )
    ],
    [
      Markup.button.callback(
        '📊 عملکرد اخیر',
        'performance'
      ),
      Markup.button.callback(
        '🎾 چرا فقط تنیس؟',
        'why_tennis'
      )
    ],
    [
      Markup.button.callback(
        '🏆 نمونه تحلیل',
        'sample_analysis'
      ),
      Markup.button.callback(
        '❓ سوالات متداول',
        'faq'
      )
    ],
    [
      Markup.button.callback(
        '💬 ارتباط با تحلیلگر',
        'support'
      )
    ]
  ]);
}


// ============================================================
// START
// ============================================================

bot.start(async (ctx) => {

  const user = getUser(ctx);

  user.step = 'start';

  await ctx.reply(
`سلام رفیق 👋

اگه دنبال فرم‌های تنیس اومدی، بذار اول یه سؤال رو جواب بدم؛ چرا فقط تنیس؟

چون بعد از حدود ۸ سال فعالیت، به این نتیجه رسیدیم که تنیس یکی از معدود بازارهاییه که اگه تحلیلش رو بلد باشی، میشه قبل از اینکه ضریب ارزش واقعی یه بازیکن رو نشون بده، فرصت‌های خوبی پیدا کرد.

یه نکته مهم هم هست...

خیلی‌ها فکر می‌کنن هرچی ضریب پایین تر باشه، بهتره؛ درحالی‌که ارزش واقعی یه فرم فقط به ضریبش نیست، به ریسکیه که برای رسیدن به اون ضریب قبول می‌کنی.

ممکنه یه فرم تک با ضریب ۳ منتشر کنیم، اما از یه فرم ضریب ۱.۷ اعتماد بیشتری بهش داشته باشیم. چون توی تنیس، هدف فقط پیدا کردن ضریب نیست؛ هدف پیدا کردن «ارزش» قبل از اینه که بازار متوجهش بشه.

ضمن اینکه همیشه هم قرار نیست فقط روی برد و باخت کار کرد. بازارهای زیادی وجود دارن که وقتی شناخت درستی از شرایط مسابقه داشته باشی، می‌تونن ارزش بیشتری نسبت به پیش‌بینی ساده‌ی برنده داشته باشن.

نحوه همکاری هم به دو صورته:
• اشتراک ماهانه برای دریافت فرم‌ها و تحلیل‌ها
• پلن رولینگ مرحله‌ای؛ مناسب افرادی که با ریسک بیشتر راحت هستن و این سبک مدیریت سرمایه رو انتخاب می‌کنن.

اگه دوست داری قبل از هر تصمیمی با سبک تحلیل من آشنا بشی، یه پیام بده.

اولین فرم ارزشمندت کاملاً رایگانه؛ خودت کیفیت تحلیل رو ببین، بعد تصمیم بگیر که ادامه بدیم یا نه. 🤝`,
    mainMenu()
  );
});


// ============================================================
// MAIN MENU
// ============================================================

bot.action('main_menu', async (ctx) => {

  await ctx.answerCbQuery();

  const user = getUser(ctx);

  user.step = 'main_menu';

  await ctx.editMessageText(
`🎾 مرکز تحلیل تنیس

اینجا می‌تونی قبل از هر تصمیمی با سبک کار، عملکرد و نحوه همکاری آشنا بشی.

اگر دنبال فرم تستی هستی، از گزینه اول شروع کن؛
فرم‌ها به‌صورت دستی تحلیل میشن و برای دریافت فرم امروز باید مستقیم به تحلیلگر پیام بدی.

👇 از کجا شروع کنیم؟`,
    mainMenu()
  );
});


// ============================================================
// WHY TENNIS
// ============================================================

bot.action('why_tennis', async (ctx) => {

  await ctx.answerCbQuery();

  trackView(ctx, 'why_tennis');

  const user = getUser(ctx);

  user.step = 'why_tennis';

  await ctx.editMessageText(
`🎾 چرا فقط تنیس؟

شاید سؤال ساده‌ای باشه، اما جوابش بخش مهمی از روش کار ماست.

در تنیس، فقط نتیجه نهایی مسابقه اهمیت نداره؛
شرایط بازیکن، سطح زمین، فرم اخیر، وضعیت بدنی، سبک بازی، Match-up و حتی نوع بازاری که انتخاب میشه، می‌تونه روی ارزش یک فرم تأثیر بذاره.

برای همین ما دنبال این نیستیم که هر روز به هر قیمتی فرم منتشر کنیم.

اگر بازی ارزش تحلیل داشته باشه، بررسیش می‌کنیم.
اگر نداشته باشه، منتشر نکردنش هم خودش یک تصمیمه.

هدف ما پیدا کردن «ضریب بالا» نیست؛
هدف پیدا کردن موقعیتیه که ارزش احتمالی اون نسبت به ریسکش منطقی باشه.

به همین دلیل ممکنه یک فرم با ضریب 3 برای ما جذاب‌تر از یک ضریب 1.5 باشه.`,
    Markup.inlineKeyboard([
      [
        Markup.button.callback(
          '🏆 دیدن نمونه تحلیل',
          'sample_analysis'
        )
      ],
      [
        Markup.button.callback(
          '📊 مشاهده عملکرد',
          'performance'
        )
      ],
      [
        Markup.button.callback(
          '🏠 منوی اصلی',
          'main_menu'
        )
      ]
    ])
  );
});


// ============================================================
// ABOUT / METHOD
// ============================================================

bot.action('about', async (ctx) => {

  await ctx.answerCbQuery();

  trackView(ctx, 'about');

  const user = getUser(ctx);

  user.step = 'about';

  await ctx.editMessageText(
`ℹ️ درباره روش کار

حدود ۸ ساله که تمرکز اصلی ما روی تحلیل مسابقات تنیس بوده و در کنار اون، بعضی مواقع فوتبال هم بررسی میشه.

اما یک تفاوت مهم وجود داره:

اینجا قرار نیست صرفاً چند ضریب انتخاب و منتشر بشه.

هر فرم قبل از انتشار از چند جهت بررسی میشه تا مشخص بشه آیا واقعاً ارزش ورود داره یا نه.


کیفیت تحلیل برای ما مهم‌تر از تعداد فرم‌هاست.

همچنین هیچ فرمی تضمین‌شده نیست؛
تصمیم نهایی و مدیریت سرمایه همیشه بر عهده خود فرده.

اگر می‌خوای سبک تحلیل رو قبل از هر همکاری ببینی، می‌تونی فرم تستی روز رو دریافت کنی.`,
    Markup.inlineKeyboard([
      [
        Markup.button.callback(
          '🎁 دریافت فرم تستی',
          'free_pick'
        )
      ],
      [
        Markup.button.callback(
          '🏠 منوی اصلی',
          'main_menu'
        )
      ]
    ])
  );
});


// ============================================================
// FREE TEST FORM
// ============================================================

bot.action('free_pick', async (ctx) => {

  await ctx.answerCbQuery();

  trackView(ctx, 'free_pick');

  const user = getUser(ctx);

  user.step = 'free_pick';

  await ctx.editMessageText(
`🎁 فرم تستی امروز

فرم تستی هر روز به‌صورت دستی بررسی و تحلیل میشه؛
به همین دلیل داخل ربات به‌صورت خودکار منتشرش نمی‌کنیم.

هدف اینه که قبل از هر تصمیمی،
اول سبک تحلیل ما رو از نزدیک ببینی.

اگر دوست داری فرم امروز رو دریافت کنی،
مستقیم به تحلیلگر پیام بده.

همون‌جا فرم برات ارسال میشه و اگر درباره تحلیل یا شرایط بازی سوالی داشته باشی، می‌تونی مطرحش کنی.

بدون تعهد و بدون نیاز به خرید اشتراک. 🤝`,
    Markup.inlineKeyboard([
      [
        Markup.button.url(
          '🎁 دریافت فرم امروز',
          supportUrl(
            'سلام، برای دریافت فرم تستی امروز پیام دادم.'
          )
        )
      ],
      [
        Markup.button.callback(
          '👑 درباره اشتراک VIP',
          'vip'
        )
      ],
      [
        Markup.button.callback(
          '🏠 منوی اصلی',
          'main_menu'
        )
      ]
    ])
  );
});


// ============================================================
// VIP
// ============================================================

bot.action('vip', async (ctx) => {

  await ctx.answerCbQuery();

  trackView(ctx, 'vip');

  const user = getUser(ctx);

  user.step = 'vip';

  await ctx.editMessageText(
`👑 اشتراک VIP

اگر بعد از دیدن فرم تستی احساس کردی این سبک تحلیل برایت مناسبه، می‌تونی وارد اشتراک VIP بشی.

در VIP فقط چند فرم خام دریافت نمی‌کنی.

تمرکز روی تحلیل و پیدا کردن موقعیت‌های باارزشه:

▫️ فرم های ضریب بالا و شکار به صورت زنده 
▫️ تحلیل اختصاصی مسابقات
▫️ بررسی شرایط و فرم بازیکنان
▫️ بررسی بازارهای مختلف، نه فقط برد و باخت
▫️ توضیح دلیل انتخاب فرم
▫️ بررسی سطح ریسک
▫️ امکان استفاده از رولینگ مرحله‌ای
▫️ ارتباط مستقیم برای سوالات و بررسی‌ها

یک نکته هم مهمه:

VIP به معنی تضمین برد نیست.

هدف، تصمیم‌گیری بر اساس تحلیل و مدیریت ریسک بهتره؛ نه دنبال کردن هر ضریب یا هر مسابقه.

اگر شرایط عضویت و هزینه رو می‌خوای بدونی، مستقیم پیام بده تا توضیحات کامل رو دریافت کنی.`,
    Markup.inlineKeyboard([
      [
        Markup.button.url(
          '👑 دریافت شرایط VIP',
          supportUrl(
            'سلام، شرایط اشتراک VIP رو می‌خواستم.'
          )
        )
      ],
      [
        Markup.button.callback(
          '🎁 اول فرم تستی رو ببینم',
          'free_pick'
        )
      ],
      [
        Markup.button.callback(
          '🏠 منوی اصلی',
          'main_menu'
        )
      ]
    ])
  );
});


// ============================================================
// PERFORMANCE
// ============================================================

bot.action('performance', async (ctx) => {

  await ctx.answerCbQuery();

  trackView(ctx, 'performance');

  const user = getUser(ctx);

  user.step = 'performance';

  await ctx.editMessageText(
`📊 عملکرد ${PERFORMANCE.period}

برای اینکه عملکرد رو شفاف ببینی:

🎾 مجموع فرم‌ها: ${PERFORMANCE.totalForms}

✅ برد: ${PERFORMANCE.wins}

❌ باخت: ${PERFORMANCE.losses}

📈 درصد موفقیت: ${PERFORMANCE.winRate}

اما یک نکته مهم‌تر از خود درصد وجود داره:

درصد برد به‌تنهایی معیار کاملی برای ارزیابی یک تحلیل نیست.

ضریب ورود، میزان ریسک، نوع بازار و نحوه مدیریت سرمایه هم اهمیت دارن.

به همین دلیل ما فقط دنبال بالا بردن تعداد بردها نیستیم؛
دنبال موقعیت‌هایی هستیم که نسبت ریسک به ارزش اون‌ها منطقی باشه.`,
    Markup.inlineKeyboard([
      [
        Markup.button.callback(
          '🏆 دیدن نمونه تحلیل',
          'sample_analysis'
        )
      ],
      [
        Markup.button.callback(
          '🎁 دریافت فرم تستی',
          'free_pick'
        )
      ],
      [
        Markup.button.callback(
          '🏠 منوی اصلی',
          'main_menu'
        )
      ]
    ])
  );
});


// ============================================================
// SAMPLE ANALYSIS
// ============================================================

bot.action('sample_analysis', async (ctx) => {

  await ctx.answerCbQuery();

  trackView(ctx, 'sample_analysis');

  const user = getUser(ctx);

  user.step = 'sample_analysis';

  await ctx.editMessageText(
`🏆 نمونه تحلیل

برای اینکه دقیق‌تر متوجه سبک کار بشی، ساختار یک تحلیل معمولی رو ببین:

🎾 مسابقه:
Player A vs Player B

🎯 بازار:
Over 22.5 Games

📊 ضریب زمان تحلیل:
2.1

🔎 موارد بررسی‌شده:

• فرم اخیر هر دو بازیکن
• عملکرد روی سطح زمین
• کیفیت سرویس و بازگشت سرویس
• Match-up بین سبک بازی دو بازیکن
• شرایط فیزیکی و مسابقات اخیر
• وضعیت بازار و ارزش ضریب

نکته اینجاست:

انتخاب فقط به این دلیل انجام نمیشه که «به نظر میاد این بازیکن می‌بره».

اول بررسی می‌کنیم آیا قیمت فعلی بازار با احتمال واقعی اتفاقی که انتظار داریم، همخوانی داره یا نه.

این تفاوت بین «حدس نتیجه» و «تحلیل بازار»ه.`,
    Markup.inlineKeyboard([
      [
        Markup.button.callback(
          '🎁 فرم تستی امروز',
          'free_pick'
        )
      ],
      [
        Markup.button.callback(
          '📊 عملکرد اخیر',
          'performance'
        )
      ],
      [
        Markup.button.callback(
          '🏠 منوی اصلی',
          'main_menu'
        )
      ]
    ])
  );
});


// ============================================================
// SUPPORT
// ============================================================

bot.action('support', async (ctx) => {

  await ctx.answerCbQuery();

  trackView(ctx, 'support');

  const user = getUser(ctx);

  user.step = 'support';

  await ctx.editMessageText(
`💬 ارتباط با تحلیلگر

اگر سوالی درباره فرم‌ها، سبک تحلیل یا اشتراک VIP داری، مستقیم پیام بده.

لازم نیست قبلش چیزی خریداری کنی؛
می‌تونی سوالت رو مطرح کنی و شرایط رو بررسی کنیم.

برای دریافت فرم تستی هم از همین مسیر می‌تونی اقدام کنی. 🤝`,
    Markup.inlineKeyboard([
      [
        Markup.button.url(
          '💬 پیام به تحلیلگر',
          supportUrl(
            'سلام، از طریق ربات پیام دادم.'
          )
        )
      ],
      [
        Markup.button.callback(
          '🎁 دریافت فرم تستی',
          'free_pick'
        )
      ],
      [
        Markup.button.callback(
          '🏠 منوی اصلی',
          'main_menu'
        )
      ]
    ])
  );
});


// ============================================================
// FAQ
// ============================================================

bot.action('faq', async (ctx) => {

  await ctx.answerCbQuery();

  trackView(ctx, 'faq');

  const user = getUser(ctx);

  user.step = 'faq';

  await ctx.editMessageText(
`❓ سوالات متداول

🔹 چرا فقط تنیس؟

چون تمرکز اصلی ما روی تحلیل مسابقات تنیسه و تجربه بیشتری در این بازار داریم.

🔹 آیا هر روز فرم منتشر میشه؟

خیر. اگر موقعیت مناسبی برای ورود وجود نداشته باشه، فرم منتشر نمی‌کنیم.

کیفیت تحلیل برای ما مهم‌تر از تعداد فرم‌هاست.

🔹 آیا فرم‌ها تضمینی هستند؟

خیر.

هیچ تحلیل ورزشی نتیجه قطعی نداره و مدیریت سرمایه بخش مهمی از کاره.

🔹 فرم تستی چطور دریافت میشه؟

فرم تستی هر روز به‌صورت دستی تحلیل میشه و برای دریافتش باید مستقیم به تحلیلگر پیام بدی.

🔹 اشتراک VIP شامل چیه؟

تحلیل‌های اختصاصی، بررسی بازارهای مختلف، توضیح دلیل انتخاب فرم و دسترسی به تحلیلگر.

🔹 رولینگ مرحله‌ای چیه؟

یک روش مدیریت و ادامه دادن فرم‌هاست که ریسک بیشتری نسبت به اشتراک معمولی داره و برای همه مناسب نیست.

اگر درباره شرایط خودت مطمئن نیستی، قبل از هر تصمیمی پیام بده تا توضیحات لازم رو دریافت کنی.`,
    Markup.inlineKeyboard([
      [
        Markup.button.callback(
          '🎁 دریافت فرم تستی',
          'free_pick'
        )
      ],
      [
        Markup.button.callback(
          '👑 شرایط VIP',
          'vip'
        )
      ],
      [
        Markup.button.callback(
          '💬 سوالی دارم',
          'support'
        )
      ],
      [
        Markup.button.callback(
          '🏠 منوی اصلی',
          'main_menu'
        )
      ]
    ])
  );
});


// ============================================================
// ADMIN PANEL
// ============================================================

bot.command('panel', async (ctx) => {

  if (!ADMIN_ID) {
    return ctx.reply(
      'ADMIN_ID در Environment Variables تنظیم نشده است.'
    );
  }

  if (
    ctx.from.id.toString() !==
    ADMIN_ID.toString()
  ) {
    return;
  }

  const allUsers = Object.values(users);

  const totalUsers = allUsers.length;

  const freePickViews = allUsers.filter(
    user =>
      user.views &&
      user.views.free_pick
  ).length;

  const vipViews = allUsers.filter(
    user =>
      user.views &&
      user.views.vip
  ).length;

  const performanceViews = allUsers.filter(
    user =>
      user.views &&
      user.views.performance
  ).length;

  const sampleViews = allUsers.filter(
    user =>
      user.views &&
      user.views.sample_analysis
  ).length;

  const supportClicks = allUsers.filter(
    user =>
      user.views &&
      user.views.support
  ).length;

  const faqViews = allUsers.filter(
    user =>
      user.views &&
      user.views.faq
  ).length;

  const whyTennisViews = allUsers.filter(
    user =>
      user.views &&
      user.views.why_tennis
  ).length;

  await ctx.reply(
`📊 پنل مدیریت

👥 کاربران ثبت‌شده:
${totalUsers}

🎁 درخواست فرم تستی:
${freePickViews}

👑 مشاهده اشتراک VIP:
${vipViews}

📊 مشاهده عملکرد:
${performanceViews}

🏆 مشاهده نمونه تحلیل:
${sampleViews}

🎾 مشاهده «چرا فقط تنیس؟»:
${whyTennisViews}

❓ مشاهده FAQ:
${faqViews}

💬 ورود به ارتباط با تحلیلگر:
${supportClicks}

━━━━━━━━━━━━━━

📈 آمار فعلی عملکرد:

فرم‌ها: ${PERFORMANCE.totalForms}
برد: ${PERFORMANCE.wins}
باخت: ${PERFORMANCE.losses}
درصد موفقیت: ${PERFORMANCE.winRate}`
  );
});


// ============================================================
// QUICK STATS
// ============================================================

bot.command('stats', async (ctx) => {

  if (!ADMIN_ID) {
    return;
  }

  if (
    ctx.from.id.toString() !==
    ADMIN_ID.toString()
  ) {
    return;
  }

  const allUsers = Object.values(users);

  const totalUsers = allUsers.length;

  const freeRequests = allUsers.filter(
    user =>
      user.views &&
      user.views.free_pick
  ).length;

  const vipRequests = allUsers.filter(
    user =>
      user.views &&
      user.views.vip
  ).length;

  const supportRequests = allUsers.filter(
    user =>
      user.views &&
      user.views.support
  ).length;

  await ctx.reply(
`📈 آمار سریع

👥 کاربران:
${totalUsers}

🎁 فرم تستی:
${freeRequests}

👑 VIP:
${vipRequests}

💬 ارتباط با تحلیلگر:
${supportRequests}

📊 عملکرد اعلام‌شده:
${PERFORMANCE.winRate}`
  );
});


// ============================================================
// ERROR HANDLER
// ============================================================

bot.catch((error, ctx) => {

  console.error(
    'Bot Error:',
    error
  );

  try {

    ctx.reply(
      'یه مشکلی پیش اومد. لطفاً دوباره تلاش کن.'
    );

  } catch (replyError) {

    console.error(
      'Reply Error:',
      replyError
    );

  }

});


// ============================================================
// EXPRESS SERVER
// ============================================================

app.get('/', (req, res) => {
  res.send(
    'Tennis Analysis Bot is running'
  );
});


const PORT =
  process.env.PORT || 3000;


app.listen(PORT, () => {

  console.log(
    `Server running on port ${PORT}`
  );

});


// ============================================================
// TELEGRAM WEBHOOK
// ============================================================

const WEBHOOK_PATH =
  `/telegraf/${process.env.BOT_TOKEN}`;


app.use(
  bot.webhookCallback(
    WEBHOOK_PATH
  )
);


const WEBHOOK_URL =
  `${process.env.RENDER_EXTERNAL_URL}${WEBHOOK_PATH}`;


bot.telegram
  .setWebhook(WEBHOOK_URL)
  .then(() => {

    console.log(
      'Tennis Analysis Bot webhook is active'
    );

  })
  .catch((error) => {

    console.error(
      'Webhook error:',
      error
    );

  });


console.log(
  '🎾 Tennis Analysis Bot LIVE'
);
