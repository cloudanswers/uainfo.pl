require("dotenv").config();
const { Telegraf } = require("telegraf");
const settings = require("../settings");
const storage = require("../storage");

const bot = new Telegraf(settings.BOT_TOKEN);

bot.start((ctx) => {
  ctx.reply(
    "Keyboard",
    Markup.inlineKeyboard([
      Markup.button.callback("First option", "first"),
      Markup.button.callback("Second option", "second"),
    ])
  );

  let message = ` Please use /info to get info`;
  ctx.reply(message);
});

bot.command("info", async (ctx) => {
  try {
    ctx.reply("Not yet implemented...");
  } catch (error) {
    console.error("ERROR", error);
    ctx.reply("error :(");
  }
});

bot.on("sticker", (ctx) => ctx.reply("✔️"));
bot.on("text", async (ctx) => {
  console.log("on text:", ctx);
  await storage.log("messages", ctx);
  ctx.reply("pong: " + JSON.stringify(ctx?.message?.text));
});

bot.on("*", (ctx) => {
  console.log("on *:", ctx);
  // TODO log to bucket
});

bot.launch();
