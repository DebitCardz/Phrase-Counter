import { getModelForClass } from "@typegoose/typegoose";
import { Message, MessageEmbed, User } from "discord.js";
import { Connection } from "mongoose";
import BotCommand from "../../lib/command";
import { Gamer } from "../../types/user";

export default class SetCash extends BotCommand {
	constructor() {
		super("setcash", "Admin command used to set a user's cash.", { devcommand: true });
	}

	async execute(message: Message, args: string[], db: Connection) : Promise<void> {

		if(args.length < 2) {
			message.channel.send(this.invalidParameters()).then(msg => {
				setTimeout(() => { if(msg.deletable) msg.delete(); }, 5*1000); //5sec.
			});
			return;
		}

		const user = message.mentions.users.first();
		const cash: number = Number(args[1]);

		if(user == null || !cash) {
			message.channel.send(this.invalidParameters()).then(msg => {
				setTimeout(() => { if(msg.deletable) msg.delete(); }, 5*1000); //5sec.
			});
			return;
		}

		const model = getModelForClass(Gamer, { existingConnection: db });
		const existingUser = await model.findOne({ user_id: user.id });

		if(existingUser) {

			await model.updateOne({ user_id: user.id }, { cash: cash });
			message.channel.send(this.updatedCashEmbed(user, cash));

		} else message.channel.send(`${user.username} (${user.id}) is not registered in the database.`);

	}

	invalidParameters() : MessageEmbed {
		const embed = new MessageEmbed();
		embed.setDescription(`Invalid Parameters! Use .setcash <user> <amount>.`);
		embed.setColor("RED");
		return embed;
	}

	updatedCashEmbed(user: User, cash: number) : MessageEmbed {
		const embed = new MessageEmbed();
		embed.setDescription(`Updated ${user} cash to ${cash}.`);
		embed.setColor("GREEN");
		return embed;
	}
}