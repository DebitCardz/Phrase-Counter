// import { getModelForClass } from "@typegoose/typegoose";
import { getModelForClass } from "@typegoose/typegoose";
import { Message, MessageEmbed, User } from "discord.js";
import { Connection } from "mongoose";
import BotCommand from "../../lib/command";
import { Gamer } from "../../types/user";
// import { Gamer } from "../../types/user";

export default class ListWordsCommand extends BotCommand {
	constructor() {
		super("listwords", "List all the words you have said and the amount", { aliases: ["lw", "wordlist", "lws"] });
	}

	async execute(message: Message, args: string[], db: Connection) {

		let page;
		let user;
		if(args.length >= 1) page = Number(args[0]);
		else page = 1;

		if(!page || page <= 0) {
			if(!message.mentions.users.first()) {
				message.channel.send(this.invalidPage()).then(msg => {
					setTimeout(() => {
						if(msg.deletable) msg.delete();
					}, 5*1000); //5sec.
				})
	
				return;
			} else { 
				user = message.mentions.users.first();
				if(args.length >= 2) page = Number(args[1]);
				else page = 1;
			}
		}	

		const model = getModelForClass(Gamer, { existingConnection: db });

		let existingUser;
		if(user) existingUser = await model.findOne({ user_id: user.id });
		else existingUser = await model.findOne({ user_id: message.author.id });
		
		if(!page) page = 1;

		if(existingUser) {

			message.channel.send(this.listWordsEmbed(message.author, this.getPhrasesSaid(existingUser, page), page));

		} else message.channel.send(this.noUserRegistered()).then(msg => {
			setTimeout(() => {
				if(msg.deletable) msg.delete();
			}, 5*1000); //5sec.
		})
	}

	invalidPage() : MessageEmbed {
		const embed = new MessageEmbed();
		embed.setDescription(`Invalid page! Please enter a valid number.`);
		embed.setColor("RED");
		return embed;
	}

	noUserRegistered() : MessageEmbed {
		const embed = new MessageEmbed();
		embed.setDescription(`You haven't said any "epic gamer words", try saying some to gain some cash!`);
		embed.setColor("RED");
		return embed;
	}

	getPhrasesSaid(gamer: Gamer, page: number) : string {
		
		const phrasesSaid = gamer.phrases;
		const maxEntriesPerPage = 6;

		let str = "";

		const startIndex = maxEntriesPerPage * page;
		const endIndex = startIndex - maxEntriesPerPage;

		let i = 0;
		for(let phrase in phrasesSaid) {
			if(str.split("\n").length == maxEntriesPerPage) break;
			if(i >= (endIndex - 1) && i <= (startIndex - 1)) 
				str += `\`${phrase}\` x**${phrasesSaid[phrase]}** times.\n`;
			i++;
		}

		return str != "" ? str : `Page ${page} is empty!`; 
	}

	listWordsEmbed(user: User, str: string, page: number) : MessageEmbed {
		const embed = new MessageEmbed();
		embed.setAuthor(`Words list - Page: ${page}.`, user.displayAvatarURL({ dynamic: true }));
		embed.setColor("GREEN");
		embed.setDescription(str);
		embed.setTimestamp();
		return embed;
	}
}