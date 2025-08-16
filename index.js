const { Telegraf } = require("telegraf");
const ytdl = require("ytdl-core");
const yts = require("yt-search");

const bot = new Telegraf(process.env.TOKEN);

bot.start(ctx => ctx.reply("Salut ! Envoie un lien vidéo ou tape /music + nom de chanson."));

bot.on("text", async (ctx) => {
  const url = ctx.message.text;
  if (ytdl.validateURL(url)) {
    try {
      const info = await ytdl.getInfo(url);
      const format = ytdl.chooseFormat(info.formats, { quality: "highest" });
      ctx.reply(`🎥 ${info.videoDetails.title}\nLien direct : ${format.url}`);
    } catch(e){
      ctx.reply("Erreur vidéo : " + e.message);
    }
  }
});

bot.command("music", async (ctx) => {
  const query = ctx.message.text.replace("/music","").trim();
  if(!query) return ctx.reply("Utilise : /music nom_de_la_chanson");

  try {
    const r = await yts(query);
    const video = r.videos[0];
    if(!video) return ctx.reply("Rien trouvé");

    ctx.reply(`🎶 ${video.title}\nLien direct : ${video.url}`);
  } catch(e){
    ctx.reply("Erreur musique : "+e.message);
  }
});

bot.launch();
console.log("Bot lancé !");
