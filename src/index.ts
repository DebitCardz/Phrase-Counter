import dotenv from "dotenv";
import fs from "fs";
import { Bot } from "./lib/bot";
import { Config } from "./types/config";

(async () => {
	dotenv.config();

	const configFile = await fs.promises.readFile("./config.json");
	const config = JSON.parse(configFile.toString()) as Config; 

	const bot = new Bot({}, config);

	bot.once("ready", () => {
		bot.user!.setActivity(config.bot.status.activity, { type: config.bot.status.type });

		console.log(`Logged into ${bot.user?.username}.`);
	});

	bot.login(process.env.TOKEN);
})();