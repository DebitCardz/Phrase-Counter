import { Message } from "discord.js";
import { Connection } from "mongoose";
import CommandOptions from "../types/commandoptions";

export default abstract class BotCommand {
	
	private readonly _name: string;
	private readonly _description: string;
	private readonly options: CommandOptions | undefined;

	protected constructor(name: string, description: string, options?: CommandOptions) {
		this._name = name;
		this._description = description;
		this.options = options;
	}

	// Executor.
	abstract async execute(message: Message, args: string[], db?: Connection) : Promise<void>;

	get name() : string {
		return this._name;
	}

	get description() : string {
		return this._description;
	}

	get aliases() : string[] {
		return this.options?.aliases || [];
	}

	get devcommand() : boolean {
		return this.options?.devcommand || false;
	}

} 