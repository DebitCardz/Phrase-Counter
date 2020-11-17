import { ActivityType } from "discord.js";

export interface Config {
	bot: BotConfig;
	prefix: string;
	developers: string[];
	shop: { [key: string]: ShopItem[] };
	phrases: { [key: string]: Phrase };
}

export interface ShopItem {
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

export interface Phrase {
	money: number;
	cooldown: number;
}