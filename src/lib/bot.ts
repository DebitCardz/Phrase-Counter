import { getModelForClass, setGlobalOptions, Severity } from "@typegoose/typegoose";
import { Client, ClientOptions, Collection, Message } from "discord.js";
import { readdirSync } from "fs";
import Mongoose from "mongoose";
import { Gamer } from "../types/user";
import BotCommand from "./command";

export class Bot extends Client {

	private commands: Collection<string, BotCommand>;
	private readonly prefix: string;
	public db: Mongoose.Connection; 

	constructor(options?: ClientOptions) {
		
		super(options || {});
		
		this.commands = new Collection();
		// TODO: Make this a config variable or something.
		this.prefix = ".";

		this.initCommands(`../commands`);
		this.initCommandHandler();

		this.initEvents(`../events`);

		this.db = Mongoose.createConnection("mongodb://localhost:27017/nwordbot", { useNewUrlParser: true });
		setGlobalOptions({ options: { allowMixed: Severity.ALLOW } });
		
		this.resetCooldowns();
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
				} catch(err) { console.log(`${ele} doesn't have a valid constructor or executor!`); }
				
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
				// efficnet 
				if(command?.devcommand) if(message.author.id != "307336287407439872") return;

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

	/**
	 * Resets all cooldowns currently in the database.
	 */
	private async resetCooldowns() {
		const model = getModelForClass(Gamer, { existingConnection: this.db });
		(await model.find({ })).forEach(async gamer => { await model.update({ user_id: gamer.user_id }, { cooldown: { } }); })
	}
}