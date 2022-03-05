require("dotenv").config();
const { Telegraf } = require("telegraf");
const settings = require("../settings");
const storage = require("../storage");

const bot = new Telegraf(settings.BOT_TOKEN);

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

bot.on("text", async (ctx) => {
  console.log("on text:", ctx);
  let fileName = await storage.log("messages", ctx);
  ctx.reply(`got it! https://uainfo.pl/${fileName}`);
});

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

bot.launch();
