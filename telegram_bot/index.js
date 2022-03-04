require("dotenv").config();
const { Telegraf } = require("telegraf");
const { v4: uuidV4 } = require("uuid");
const { BOT_TOKEN } = process.env;

const bot = new Telegraf(BOT_TOKEN);

bot.start((ctx) => {
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

bot.launch();
