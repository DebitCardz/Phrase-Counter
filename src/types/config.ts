import { ActivityType } from "discord.js";

export interface Config {
	bot: BotConfig;
	prefix: string;
	developers: string[];
	shop: {[key: string]: ShopPage}
}

export interface ShopPage {
	name: string;
	description: string;
	price: number;
}

export interface BotConfig {
	status: BotStatusConfig;
}

export interface BotStatusConfig {
	activity: string;
	type: ActivityType;
}