import dotenv from "dotenv";
import { Bot } from "./lib/bot";
const config = require('../config.json');

dotenv.config();

export const bot: Bot = new Bot();

bot.once('ready', () => {
	bot.user?.setActivity(config.bot.status.activity, { type: config.bot.status.type.toUpperCase() });

	console.log(`Logged into ${bot.user?.username}.`);
});

bot.login(process.env.TOKEN);