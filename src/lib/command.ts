import { Message } from "discord.js";
import CommandOptions from "../types/commandoptions";
import { Bot } from "./bot";

export default abstract class BotCommand {
	
	private readonly _name: string;
	private readonly _description: string;
	private readonly options: CommandOptions | undefined;

	protected constructor(name: string, description: string, options?: CommandOptions) {
		this._name = name;
		this._description = description;
		this.options = options;
	}

	/**
	 * 
	 * @param message 
	 * @param args 
	 * @param db 
	 */
	abstract async execute(bot: Bot, message: Message, args: string[]) : Promise<void>;

	get name() : string {
		return this._name;
	}

	get description() : string {
		return this._description;
	}

	get category() : string {
		return this.options?.category || "None";
	}

	get aliases() : string[] {
		return this.options?.aliases || [];
	}

	get devcommand() : boolean {
		return this.options?.devcommand || false;
	}

} 