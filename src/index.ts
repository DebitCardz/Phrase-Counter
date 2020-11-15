import dotenv from "dotenv";
import { Bot } from "./lib/bot";

dotenv.config();

const bot = new Bot(); 

bot.once('ready', () => {
	bot.user?.setActivity(`Tech develop this garbage`, { type: "WATCHING" });

	console.log(`Unfortunately logged into ${bot.user?.username}!`);
})

// this was a fucking mistake.
bot.login(process.env.TOKEN);