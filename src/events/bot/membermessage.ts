import { getModelForClass } from "@typegoose/typegoose";
import { Bot } from "../../lib/bot";
import { Gamer } from "../../types/user";

const phrases = require('../../../phrases.json');

export default class MemberMessage {	
	constructor(client: Bot) {
		client.on("message", async (message) => {
			for(let obj of phrases) {
				let phrase: string = obj.phrase.toLowerCase();
				if(!message.content.toLowerCase().includes(phrase)) continue;
			
				const rnum = Number(Math.max(Math.random() * (1.2 - 0.8) + 0.8).toFixed(2));
				let money: number = Math.ceil(obj.money * rnum);

				const cooldown: number = obj.cooldown;

				const model = getModelForClass(Gamer, {existingConnection: client.db});

				const existingUser = await model.findOne({ user_id: message.author.id });

				if(existingUser) {

					if(existingUser.cooldown[phrase] != null) {
						const diff = Math.floor((Date.now() - existingUser.cooldown[phrase]) / 1000)
						if(diff <= cooldown) return;
					} 

					await model.updateOne({ user_id: message.author.id }, { cash: existingUser.cash += money });
				
					if(existingUser.phrases[phrase] == null) await model.update({ user_id: message.author.id }, { phrases: { ...existingUser.phrases, [phrase]: 1 } });
					else await model.updateOne({ user_id: message.author.id }, { phrases: { ...existingUser.phrases, [phrase]: existingUser.phrases[phrase] + 1 } });

					await model.updateOne({ user_id: message.author.id }, { cooldown: { ...existingUser.cooldown, [phrase]: Date.now() } });
					
				} else await model.create({ user_id: message.author.id, cash: money, inventory: [], phrases: { [phrase]: 1 }, cooldown: { [phrase]: Date.now() } });
			}
		})
	}

}