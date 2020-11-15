import { Message, MessageEmbed, User } from "discord.js";
import { Connection } from "mongoose";
import BotCommand from "../../lib/command";
import { Shop } from "../../lib/shop";
import ShopItem from "../../types/shopitem";

export default class ShopCommand extends BotCommand {
	
	private readonly shop: Shop;
	private readonly numsToEmoji: string[];

	constructor() {
		super("shop", "Shop command", { aliases: ["store"], devcommand: true });

		this.shop = new Shop();
		this.numsToEmoji = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '❌'];
	}

	async execute(message: Message, args: string[], db: Connection) {
		this.displayShopEmbed(message.author, 1, message);
	}

	/**
	 * Display the basic shop embed in chat.
	 * @param user
	 * @param page The catalog page that should be displayed.
	 * @param message 
	 */
	async displayShopEmbed(user: User, page: number, message: Message) {
		let items: ShopItem[] = this.shop.getCatalogPage(page-1)

		const embed = new MessageEmbed();
		embed.setAuthor(`Shop - Page: ${page}.`, user.displayAvatarURL({ dynamic: true }));

		let i = 0;
		for(let item of items) {
			i++;

			// If the price is -1 that is an indicator that it is an invalid item and to display this.
			if(!item.price || item.price == -1) {
				embed.addField(`No items!`, `Page **${page}** doesn't have any items to display.`);
				break;
			}

			embed.addField(`**[${i}]** ${item.name} -- \$${item.price}`, item.description);
		}
		embed.setTimestamp();

		message.channel.send(embed).then(async msg => {

			// The only thing embed fields should be used for in this context is
			// to display the items in the shop, possibly use description to display other information?
			for(let i = 0; i < embed.fields.length; i++) 
				// The only valid values are 0-4, to display the emojis.
				// 5 is reserved for "X". 
				if(i != 5 && this.numsToEmoji[i]) msg.react(this.numsToEmoji[i]);
			msg.react(this.numsToEmoji[5]);

		}).catch(err => { console.error(err); })
	}
}