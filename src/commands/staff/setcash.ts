import { getModelForClass } from "@typegoose/typegoose";
import { Message } from "discord.js";
import { Connection } from "mongoose";
import BotCommand from "../../lib/command";
import { Gamer } from "../../types/user";

export default class SetCash extends BotCommand {
	constructor() {
		super("setcash", "Admin command used to set a user's cash.", { devcommand: true });
	}

	async execute(message: Message, args: string[], db: Connection) : Promise<void> {

		if(args.length < 2) {
			message.channel.send(`Usage: .setcash <user> <amount>.`);
			return;
		}

		const user = message.mentions.users.first();
		const cash: number = Number(args[1]);

		if(user == null || cash == NaN) {
			message.channel.send(`Invalid parameters set.`);
			return;
		}

		const model = getModelForClass(Gamer, { existingConnection: db });
		const existingUser = await model.findOne({ user_id: user.id });

		if(existingUser) {

			await model.updateOne({ user_id: user.id }, { cash: cash });
			message.channel.send(`Updated ${user.username}'s (${user.id}) cash to **\$${cash}**.`);

		} else message.channel.send(`${user.username} (${user.id}) is not registered in the database.`);

	}
}