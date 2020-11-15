import { getModelForClass } from "@typegoose/typegoose";
import { Message, MessageEmbed } from "discord.js";
import { Connection } from "mongoose";
import BotCommand from "../../lib/command";
import { Gamer } from "../../types/user";

export default class ListWordsCommand extends BotCommand {
	constructor() {
		super("listwords", "List all the words you have said and the amount", { aliases: ["lw", "wordlist", "lws"] });
	}

	async execute(message: Message, args: string[], db: Connection) {

		let page;
		if(args.length >= 1) page = Number(args[0]);
		else page = 1;

		if(!page || page <= 0) {
			message.channel.send(`Please enter a valid page number.`);
			return;
		}
		
		let model = getModelForClass(Gamer, { existingConnection: db });

		let existingUser = await model.findOne({ user_id: message.author.id });
		if(existingUser) {

			const phrases = existingUser.phrases;
			let phrasesArr = [];

			const maxEntriesPerPage = 6;

			let startIndex = maxEntriesPerPage * page;
			let endIndex = startIndex - maxEntriesPerPage;

			let i = 0;
			for(let phrase in phrases) {
				// great code.
				if(phrasesArr.length == maxEntriesPerPage) break;
				if(i >= endIndex && i <= startIndex) 
					phrasesArr.push(phrase);
				i++;				
			}

			const embed = new MessageEmbed();
			embed.setAuthor(`Words List - Page: ${page}`, message.author.displayAvatarURL({ dynamic: true }));
			
			let str = "";
			if(phrasesArr.length == 0) str += "This page is empty.";
			else {
				str += `${message.author} has said,\n\n`;
				phrasesArr.forEach(phrase => { str += `\`${phrase}\` x**${phrases[phrase]}** times.\n`; });
			}
			embed.setDescription(str)
			embed.setTimestamp();

			message.channel.send(embed);

		} else message.channel.send(`You aren't registered in the database, try saying some epic gamer words to display your stats!`);
	}
}