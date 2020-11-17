import { getModelForClass } from "@typegoose/typegoose";
import { Collection, User } from "discord.js";
import { Bot } from "../../lib/bot";
import { Gamer } from "../../types/user";

/*
Moved the cooldown system out of the database to save time from
calling the database everytime, not to mention how whenever the bot restarts 
we wipe the database of all cooldowns, This just seems more efficient.
*/

export default class MemberMessage {	
	
	private bot: Bot;
	public cooldown: Collection<string, string[]>;

	constructor(bot: Bot) {
		this.bot = bot;
		this.cooldown = new Collection();

		this.initListener();
	}

	/**
	 * INIT!!!!
	 */
	private initListener() {
		const phrases = this.bot.config.phrases;

		this.bot.on("message", async (message) => {
			if(message.author.bot) return;

			for(const p in phrases) {
				const phrase = phrases[p];
				
				if(!message.content.toLowerCase().includes(p)) continue;
				if(this.cooldown.get(message.author.id)?.includes(p)) break;

				// Cooldown logic.
				const cooldown: number = phrase.cooldown;
				if(cooldown) {
					// Checks if the user has a cooldown array set.
					if(this.cooldown.get(message.author.id)) {
						// Gets the list of everything the user is currently on cooldown for.
						let phrasesSaid = this.cooldown.get(message.author.id);
						if(phrasesSaid?.includes(p)) return;
						
						// Pushes the new thing the user has said to the array. 
						phrasesSaid?.push(p);
						if(phrasesSaid) this.cooldown.set(message.author.id, phrasesSaid);

						this.startCooldownResetTimer(message.author, p, phrase.cooldown)
					} else { 
						// Creates a new array when the user says a "gamer word" for the first time.
						this.cooldown.set(message.author.id, [`${p}`]);
						this.startCooldownResetTimer(message.author, p, phrase.cooldown)
					}
				}

				const money = this.calculateCashEarned(phrase.money);

				const model = getModelForClass(Gamer, { existingConnection: this.bot.db });

				const existingUser = await model.findOne({ user_id: message.author.id });
				if(existingUser) {

					// If the gamer word has never been said before it'll return undefined
					// if that's the case make this variable 0 so down below when we update the database
					// it just does 0 + 1, which is 1.
					const curTimesPhraseSaid = existingUser.phrases[p] ? existingUser.phrases[p] : 0; 
					await model.updateOne({ user_id: message.author.id }, { 
						cash: existingUser.cash += money, 
						phrases: { ...existingUser.phrases, [p]: curTimesPhraseSaid + 1 }
					});

				} else await model.create({ user_id: message.author.id, cash: money, phrases: { [p]: 1 }, inventory: [] });
			}		
		});
	}

	/**
	 * Calculate the amount of cash the money should earn from saying a gamer word.
	 * @param money Money gained before random multiper.
	 * @returns The amount of money the user has gained.
	 */
	public calculateCashEarned(money: number) : number {
		const randomNumber: number = Number(Math.max(Math.random() * (1.2 - 0.8) + 0.8));
		return Math.ceil(money * randomNumber);
	}

	/**
	 * Starts the timer to remove the gamer word from the cooldown list.
	 * @param user 
	 * @param phrase The phrase the user said.
	 * @param cooldown Cooldown until the phrase is removed, in seconds.
	 */
	private startCooldownResetTimer(user: User, phrase: string, cooldown: number) {
		setTimeout(() => {
			let phraseArr = this.cooldown.get(user.id)?.filter(item => item !== phrase);
			if(phraseArr) this.cooldown.set(user.id, phraseArr);
		}, cooldown*1000);
	}
}