// import { getModelForClass } from "@typegoose/typegoose";
import { getModelForClass } from "@typegoose/typegoose";
import { Message, MessageEmbed, User } from "discord.js";
import { Bot } from "../../lib/bot";
import BotCommand from "../../lib/command";
import { Gamer } from "../../types/user";

export default class ListWordsCommand extends BotCommand {
	constructor() {
		super("listwords", "List all the words you have said and the amount.", { aliases: ["lw", "wordlist", "lws"], category: "General" });
	}

	async execute(bot: Bot, message: Message, args: string[]) {

		let page;
		let user;
		if(args.length >= 1) page = Number(args[0]);
		else page = 1;

		// Initial check to make sure the page is set.
		if(!page || page <= 0) {
			// If nobody is mentioned in the message they
			// probably did something wrong when inputing a page.
			// So just send an error message.
			if(!message.mentions.users.first()) {
				message.channel.send(this.invalidPage()).then(msg => {
					setTimeout(() => {
						if(msg.deletable) msg.delete();
					}, 5*1000); //5sec.
				})
	
				return;
			} else { 
				// If someone is mentioned set this variable
				user = message.mentions.users.first();
				// And if args.length >= 2 set the page again to be valid.
				if(args.length >= 2) page = Number(args[1]);
				else if(!page) page = 1;
				else page = 1;
			}
		}	

		const model = getModelForClass(Gamer, { existingConnection: bot.db });

		// Should only be set in the case of which .lw <@mention> is done.
		let existingUser;
		if(user) existingUser = await model.findOne({ user_id: user.id });
		else existingUser = await model.findOne({ user_id: message.author.id });

		if(existingUser) {
			// Might? do something more here, for now just display the embed.
			message.channel.send(this.listWordsEmbed(message.author, this.getPhrasesSaid(existingUser, page), page));

		} else message.channel.send(this.noUserRegistered(user)).then(msg => {
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

	noUserRegistered(user?: User) : MessageEmbed {
		const embed = new MessageEmbed();
		if(!user) embed.setDescription(`You haven't said any "epic gamer words", try saying some to gain some cash!`);
		else embed.setDescription(`${user} hasn't said any "epic gamer words" yet.`);
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
			if(str.split("\n").length === maxEntriesPerPage) break;
			if(i >= (endIndex - 1) && i <= (startIndex - 1)) 
				str += `\`${phrase}\` x**${phrasesSaid[phrase]}** ${phrasesSaid[phrase] !== 1 ? "times" : "time"}.\n`;
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