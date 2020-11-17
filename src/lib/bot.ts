import { setGlobalOptions, Severity } from "@typegoose/typegoose";
import { Client, ClientOptions, Collection, Message, MessageEmbed } from "discord.js";
import { readdirSync } from "fs";
import Mongoose from "mongoose";
import BotCommand from "./command";

const config = require('../../config.json');

export class Bot extends Client {

	public readonly commands: Collection<string, BotCommand>;
	public readonly helpEmbed = new MessageEmbed();
	private readonly prefix: string;
	public db: Mongoose.Connection; 

	constructor(options?: ClientOptions) {
		super(options || {});
		
		this.commands = new Collection();
		this.prefix = config.prefix;

		this.initCommands(`../commands`);
		this.initCommandHandler();

		this.initDocsBuilder();

		this.initEvents(`../events`);

		this.db = Mongoose.createConnection(`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`, { useNewUrlParser: true, useUnifiedTopology: true });
		setGlobalOptions({ options: { allowMixed: Severity.ALLOW } });
	}

	/**
	 * Init the commands for the bot.
	 * @param dir Current directory the bot is searching through 
	 */
	private initCommands(dir: string) {
		readdirSync(`${__dirname}/${dir}`).forEach(ele => {
			// Valid command file
			if(ele.endsWith(".js") || ele.endsWith(".ts")) {
				try {
					const { default: cmdFile } = require(`${dir}/${ele}`);
					const command: BotCommand = new cmdFile();

					return this.commands.set(command.name, command);
				} catch(err) { 
					console.error(err);
					// console.log(`${ele} doesn't have a valid constructor or executor!`); 
				}
				
			}
			// Folder
			else if(ele.endsWith("")) {
				return this.initCommands(`${dir}/${ele}`);
			}

			else return;
		})
	}

	/**
	 * Command listener.
	 */
	private initCommandHandler() {
		this.on("message", async (message: Message) => {
			if(!message.content.startsWith(this.prefix) || message.author.bot) return;

			const args: string[] = message.content.slice(this.prefix.length).trim().split(/ +/);
			const commandName: string = args.shift()!.toLowerCase();

			const command: BotCommand | undefined = 
				this.commands.get(commandName) || this.commands.find((cmd) => cmd.aliases.includes(commandName));
			
			try {
				if(command?.devcommand && !config.developers.includes(message.author.id)) return;

				command?.execute(message, args, this.db);

			} catch(err) { console.error(err); }
		})
	}

	/**
	 * Init the events the bot listens to.
	 * @param dir Current directory the bot is searching through
	 */
	private initEvents(dir: string) {
		readdirSync(`${__dirname}/${dir}`).forEach(ele => {
			// Valid event file
			if(ele.endsWith(".js") || ele.endsWith(".ts")) {
				const { default: eventFile } = require(`${dir}/${ele}`);

				return new eventFile(this);
			}
			// Folder
			else if(ele.endsWith("")) {
				return this.initEvents(`${dir}/${ele}`);
			}

			else return;
		})
	}

	private initDocsBuilder() {
		this.helpEmbed.setColor("BLUE");

		let catCmdsList: Collection<string, string> = new Collection();
		let amtOfCmdsPerCat: Collection<string, number> = new Collection();
		for(let cmd of this.commands) {
			let botCmd = cmd[1];
		
			let str = "";
			if(botCmd.aliases.length != 0) str += `**${botCmd.name}**, ${botCmd.aliases.join(", ")}. -- ${botCmd.description}\n`; 
			else str += `**${botCmd.name}**. -- ${botCmd.description}\n`;

			catCmdsList.set(botCmd.category, `${catCmdsList.get(botCmd.category) || ""} ${str}`);
			amtOfCmdsPerCat.set(botCmd.category, Number(`${amtOfCmdsPerCat.get(botCmd.category) || 0}`) + 1)
		}

		for(let key of catCmdsList.keys()) {
			this.helpEmbed.addField(`[${amtOfCmdsPerCat.get(key) || -1}] ${key}:`, `${catCmdsList.get(key)}`);
		}
	}

	// Removed because cooldowns were moved to a variable.
	/**
	 * Resets all cooldowns currently in the database.
	 */
	// private async resetCooldowns() {
	// 	const model = getModelForClass(Gamer, { existingConnection: this.db });
	// 	(await model.find({ })).forEach(async gamer => { await model.update({ user_id: gamer.user_id }, { cooldown: { } }); })
	// }
}