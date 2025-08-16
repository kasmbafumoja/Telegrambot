// ===== BOT TELEGRAM MULTIFONCTION =====
const { Telegraf } = require("telegraf");
const ytdl = require("ytdl-core");
const yts = require("yt-search");

// Token Telegram directement intégré
const bot = new Telegraf("8269001298:AAGppKtaV-EMxRjpnBcKfiSW6zq7tWaqWtI");

// Message de bienvenue
bot.start((ctx) => {
    ctx.reply("👋 Salut ! Envoie un lien vidéo ou tape /music + titre pour chercher une musique.");
});

// Télécharger une vidéo par lien
bot.on("text", async (ctx) => {
    const url = ctx.message.text;

    // Vérifie si c'est un lien valide YouTube/TikTok
    if (ytdl.validateURL(url)) {
        ctx.reply("⏳ Téléchargement vidéo...");
        try {
            const info = await ytdl.getInfo(url);
            const format = ytdl.chooseFormat(info.formats, { quality: "highest" });
            ctx.reply(`🎥 ${info.videoDetails.title}\nLien direct : ${format.url}`);
        } catch (e) {
            ctx.reply("❌ Erreur vidéo : " + e.message);
        }
    }
});

// Recherche musique par mot-clé
bot.command("music", async (ctx) => {
    const query = ctx.message.text.replace("/music", "").trim();
    if (!query) return ctx.reply("⚠️ Utilise : /music nom_de_la_chanson");

    try {
        const r = await yts(query);
        const video = r.videos[0];
        if (!video) return ctx.reply("❌ Rien trouvé pour cette recherche");

        ctx.reply(`🎶 ${video.title}\nLien direct : ${video.url}`);
    } catch (e) {
        ctx.reply("❌ Erreur musique : " + e.message);
    }
});

// Lancement du bot
bot.launch();
console.log("🤖 Bot lancé avec succès !");
