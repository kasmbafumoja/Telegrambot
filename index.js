const { Telegraf, Markup } = require("telegraf");
const ytdl = require("ytdl-core");
const yts = require("yt-search");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const bot = new Telegraf("8269001298:AAGppKtaV-EMxRjpnBcKfiSW6zq7tWaqWtI");

// Menu principal
bot.start((ctx) => {
  ctx.reply(
    "👋 Salut ! Choisis une option :",
    Markup.keyboard([
      ["📸 Supprimer Fond", "🎵 Musique"],
      ["🎥 Vidéo", "☎️ Temp Number"],
      ["🤖 Bots WhatsApp", "🖼 Générateur IA"]
    ]).resize()
  );
});

// Handler pour supprimer le fond
bot.hears("📸 Supprimer Fond", (ctx) => {
  ctx.reply("Envoie-moi une photo et je vais supprimer le fond !");
  bot.once("photo", async (ctx2) => {
    const fileId = ctx2.message.photo.pop().file_id;
    const fileLink = await ctx2.telegram.getFileLink(fileId);

    try {
      const res = await axios({
        method: "post",
        url: "https://api.remove.bg/v1.0/removebg",
        headers: { "X-Api-Key": "j4qUWwW34TDVYv3QtrroynEh" },
        data: { image_url: fileLink.href, size: "auto" },
        responseType: "arraybuffer",
      });

      const filePath = path.join(__dirname, "no-bg.png");
      fs.writeFileSync(filePath, res.data);
      await ctx2.replyWithPhoto({ source: filePath });
      fs.unlinkSync(filePath);
    } catch (e) {
      ctx2.reply("❌ Erreur suppression du fond : " + e.message);
    }
  });
});

// Temp Number
bot.hears("☎️ Temp Number", (ctx) => {
  ctx.reply("Voici un service de numéros temporaires : https://smsreceivefree.com/");
});

// Bots WhatsApp
bot.hears("🤖 Bots WhatsApp", (ctx) => {
  ctx.reply(
    "Quelques projets GitHub pour bots WhatsApp :\n\n" +
      "- https://github.com/open-wa/wa-automate-nodejs\n" +
      "- https://github.com/adiwajshing/Baileys\n" +
      "- https://github.com/venom-bot/venom\n"
  );
});

// Générateur IA
bot.hears("🖼 Générateur IA", (ctx) => {
  ctx.reply("Envoie un mot-clé pour générer une image cartoon !");
  bot.once("text", async (ctx2) => {
    const prompt = ctx2.message.text;
    try {
      const res = await axios.post(
        "https://api.deepai.org/api/text2img",
        { text: prompt },
        { headers: { "Api-Key": "j4qUWwW34TDVYv3QtrroynEh" }, responseType: "json" }
      );
      ctx2.reply(res.data.output_url);
    } catch (e) {
      ctx2.reply("❌ Erreur génération image : " + e.message);
    }
  });
});

// Télécharger vidéo YouTube
bot.hears("🎥 Vidéo", (ctx) => {
  ctx.reply("Envoie le lien YouTube pour obtenir le lien direct !");
  bot.once("text", async (ctx2) => {
    const url = ctx2.message.text;
    if (ytdl.validateURL(url)) {
      try {
        const info = await ytdl.getInfo(url);
        const format = ytdl.chooseFormat(info.formats, { quality: "highest" });
        ctx2.reply(`🎥 ${info.videoDetails.title}\nLien direct : ${format.url}`);
      } catch (e) {
        ctx2.reply("❌ Erreur vidéo : " + e.message);
      }
    } else {
      ctx2.reply("❌ Lien non valide !");
    }
  });
});

// Recherche musique via /music
bot.command("music", async (ctx) => {
  const query = ctx.message.text.replace("/music", "").trim();
  if (!query) return ctx.reply("⚠️ Utilise : /music nom_de_la_chanson");

  try {
    const r = await yts(query);
    const video = r.videos[0];
    if (!video) return ctx.reply("❌ Rien trouvé");

    ctx.reply(`🎶 ${video.title}\nLien direct : ${video.url}`);
  } catch (e) {
    ctx.reply("❌ Erreur musique : " + e.message);
  }
});

// Lancement du bot
bot.launch();
console.log("🤖 Bot multifonction stable lancé !");
