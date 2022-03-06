require("dotenv").config();
const { Telegraf, Markup } = require("telegraf");
const axios = require("axios");
const settings = require("../settings");
const storage = require("../storage");
const sleep = (ms) => new Promise((x) => setTimeout(x, ms));
const bot = new Telegraf(settings.BOT_TOKEN);
// for debug: bot.use(Telegraf.log());

bot.start((ctx) => {
  let message = ` Please use /info to get info`;
  ctx.reply(message);
});

bot.command("info", async (ctx) => {
  try {
    ctx.reply(
      "Just forward message to the bot and it will be published on uainfo.pl (this is a work in progress)"
    );
  } catch (error) {
    console.error("ERROR", error);
    ctx.reply("error :(");
  }
});

const tags = "Housing Border Supplies Transport Legal".split(" ").sort();
const keyboard = Markup.inlineKeyboard(
  [
    Markup.button.url("🔗", "https://uainfo.pl"),
    ...tags.map((x) => Markup.button.callback("Tag: " + x, `tag ${x}`)),
    Markup.button.callback("Delete", `delete`),
  ],
  { columns: 4 }
);

bot.on("message", async (ctx) => {
  console.log("on message:", ctx);
  const fileName = await storage.log("messages", ctx);
  console.log({ fileName });

  try {
    ctx.reply(
      `information saved, your info will appear here in a minute: https://uainfo.pl/${fileName}`,
      keyboard
    );
    // if (settings.NETLIFY_WEBHOOK_URL) {
    //   let res = await axios.post(settings.NETLIFY_WEBHOOK_URL);
    //   console.debug("netlify res:", res);
    // }
  } catch (e) {
    console.error(e);
  }
});

bot.action("delete", (ctx) => {
  console.debug("delete", ctx);
  ctx.deleteMessage();
  // TODO don't fully delete, just soft delete so user can re-publish if an accident
});

bot.action(/tag .+/, async (ctx) => {
  console.log("tag action:", ctx, ctx.update);
  const origMessage = ctx.update.callback_query.message.text;
  const tag = ctx.update.callback_query.data.split(" ")[1];
  await ctx.answerCbQuery(`${tag} 👍`);
  ctx.editMessageText(origMessage + " UPDATING...");
  // const x = storage.get();
  await sleep(2000);
  // TODO store the tag
  const tagPath = `tags/${tag}.txt`;
  let tagData = await storage.get(tagPath).catch(() => "");
  await storage.put(tagPath, tagData + "\n" + "todo: filename?");

  ctx.editMessageText(origMessage + " TAGGED.", keyboard);
  // ctx.editMessageCaption("_Caption_", {
  //   parse_mode: "Markdown",
  //   ...Markup.inlineKeyboard([
  //     Markup.button.callback("Plain", "plain"),
  //     Markup.button.callback("* Italic *", "italic"),
  //   ]),
  // });
});

bot.action(/.+/, (ctx) => {
  console.log("catch-all action:", ctx);
  return ctx.answerCbQuery(`Oh, ${ctx.match[0]}! Great choice`);
});

bot.action("btn-1", (ctx) => ctx.answerCallbackQuery("Yay!"));

bot.on("document", async (ctx) => {
  console.log("on text:", ctx);
  let fileName = await storage.log("documents", ctx);
  ctx.reply(`got it! https://uainfo.pl/${fileName}`);
});

bot.on("edited_message", async (ctx) => {
  console.log("on text:", ctx);
  let fileName = await storage.log("edited_message", ctx);
  ctx.reply(`got it! https://uainfo.pl/${fileName}`);
});

bot.on("forward_date", async (ctx) => {
  console.log("on text:", ctx);
  let fileName = await storage.log("forward_date", ctx);
  ctx.reply(`got it! https://uainfo.pl/${fileName}`);
});

bot.on("location", async (ctx) => {
  console.log("on text:", ctx);
  let fileName = await storage.log("location", ctx);
  ctx.reply(`got it! https://uainfo.pl/${fileName}`);
});

bot.on("photo", async (ctx) => {
  console.log("on text:", ctx);
  let fileName = await storage.log("photo", ctx);
  ctx.reply(`got it! https://uainfo.pl/${fileName}`);
});

bot.on("video", async (ctx) => {
  console.log("on text:", ctx);
  let fileName = await storage.log("video", ctx);
  ctx.reply(`got it! https://uainfo.pl/${fileName}`);
});

bot.on(/.*/, async (ctx) => {
  console.log("catch-all:", ctx);
  let fileName = await storage.log("catch-all", ctx);
  ctx.reply(`catch-all captured: https://uainfo.pl/${fileName}`);
});

bot.launch();
