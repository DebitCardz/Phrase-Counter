import { getModelForClass } from "@typegoose/typegoose";
import { Message, MessageEmbed, User } from "discord.js";
import { Bot } from "../../lib/bot";
import BotCommand from "../../lib/command";
import { Gamer } from "../../types/user";

export default class BalanceCommand extends BotCommand {
	constructor() {
		super("balance", "Get the amount of money you have.", { aliases: ["bal", "money", "cash"], category: "Economy" });
	}

	async execute(bot: Bot, message: Message, args: string[]) : Promise<void> {

		const model = getModelForClass(Gamer, { existingConnection: bot.db });

		let user;
		// other person
		if(args.length >= 1) user = message.mentions.users.first();
		// self
		else user = message.author;

		if(!user) {
			message.channel.send(this.noUserByThatMention()).then(msg => {
				setTimeout(() => {
					if(msg.deletable) msg.delete();
				}, 5*1000); //5sec.
			})
			return;
		}

		const existingUser = await model.findOne({ user_id: user.id });

		if(existingUser) message.channel.send(this.balanceEmbed(user, existingUser.cash));
		else message.channel.send(this.balanceEmbed(user, 0));
	}

	noUserByThatMention() : MessageEmbed {
		const embed = new MessageEmbed();
		embed.setDescription(`Sorry! There no user by that name.`);
		embed.setColor("RED");
		return embed;
	}

	/**
	 * Display a specific users balance in an embed.
	 * @param user
	 * @param balance 
	 */
	balanceEmbed(user: User, balance: number) : MessageEmbed {
		const embed = new MessageEmbed();
		embed.setAuthor(`${user.username}'s cash.`, user.displayAvatarURL({ dynamic: true }));
		embed.addField(`Cash:`, `${user} has \$${balance}.`);
		embed.setTimestamp();
	
		return embed;
	}
} 