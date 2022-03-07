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
  ctx.reply(
    "Just forward message to the bot and it will be published on uainfo.pl (this is a work in progress)"
  );
});

const trim = (txt, len = 64) => (txt.length > len ? txt.substr(0, len) : txt);
const modKeyboard = Markup.inlineKeyboard([
  Markup.button.callback("Approve", trim(`mod approve`)),
  Markup.button.callback("Reject", trim(`mod reject`)),
]);

async function addKeyToModFile(file, key) {
  let rejectedKeys;
  try {
    rejectedKeys = await (await storage.get(file)).split("\n");
  } catch (e) {
    rejectedKeys = [];
  }
  rejectedKeys.push(key);
  await storage.put(file, rejectedKeys.join("\n"), false);
}

async function postModRequest(ctx) {
  const rejectedKeys = await (
    await storage.get("mod_rejected.txt")
  ).split("\n");
  let nextMsgKey;
  let nextMsg;
  for await (const x of storage.list("", "")) {
    if (rejectedKeys.includes(x)) continue;
    try {
      const o = JSON.parse(await storage.get(x));
      if (o._mod_status == "reject") {
        await addKeyToModFile("mod_rejected.txt", x);
        continue;
      }
      if (o._mod_status == "approve") {
        await addKeyToModFile("mod_approved.txt", x);
        continue;
      }
      nextMsgKey = x;
      nextMsg = o;
      break;
    } catch (e) {
      // ignore
    }
  }
  const { update } = nextMsg;
  const { from } = update.message;
  ctx.reply(
    `https://uainfo.pl/${nextMsgKey}\nFrom: ${from.first_name} ${from.last_name}\n${update.message.text}`,
    modKeyboard
  );
}

bot.command("mod", postModRequest);

bot.action(/^mod (approve|reject)/, async (ctx) => {
  const [cmd, status] = ctx.update.callback_query.data.split(/ +/);
  console.log({ cmd, status });
  console.log(ctx.update);
  // TODO get the key from original message
  let key = ctx.update.callback_query.message.text.split("\n")[0];
  key = key.replace("https://uainfo.pl/", "");
  ctx.editMessageText(
    ctx.update.callback_query.message.text + `\n UPDATING...`,
    modKeyboard
  );
  // find the doc
  let foundDocs = [];
  for await (const x of storage.list(key, "")) {
    foundDocs.push(x);
  }
  if (!foundDocs.length || foundDocs.length > 1) {
    return ctx.reply(`did not find match for ${key}`);
  }
  let msg = await storage.getJson(foundDocs[0]);
  msg._mod_status = status;
  await storage.putJson(foundDocs[0], msg);
  if (status == "approve") {
    await addKeyToModFile("mod_approved.txt", key);
  } else if (status == "reject") {
    await addKeyToModFile("mod_rejected.txt", key);
  }

  ctx.editMessageText(
    ctx.update.callback_query.message.text + `\n UPDATED: ${status}`,
    modKeyboard
  );

  // post the next one to mod...
  postModRequest(ctx);
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
  console.debug(
    "delete",
    ctx,
    ctx.update,
    JSON.stringify(ctx.update.callback_query, undefined, 2)
  );
  ctx.deleteMessage();
  // TODO don't fully delete, just soft delete so user can re-publish if an accident
  // storage.get();
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
});

bot.action(/.+/, (ctx) => {
  console.log("catch-all action:", ctx);
  return ctx.answerCbQuery(`UNKNOWN CHOICE: ${ctx.match[0]}!`);
});

bot.on(/.*/, async (ctx) => {
  console.log("catch-all:", ctx);
  let fileName = await storage.log("catch-all", ctx);
  ctx.reply(`catch-all captured: https://uainfo.pl/${fileName}`);
});

bot.launch();
