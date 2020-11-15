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
		console.log(this.numsToEmoji);
		
	}

	async execute(message: Message, args: string[], db: Connection) {
		this.displayShopEmbed(this.shop.getCatalogPage(1 - 1), message.author, 1, message);
	}

	async displayShopEmbed(items: ShopItem[], user: User, page: number, message: Message) {

		const embed = new MessageEmbed();
		embed.setAuthor(`Shop - Page: ${page}.`, user.displayAvatarURL({ dynamic: true }));

		let i = 0;
		for(let item of items) {
			i++;

			if(!item.price || item.price == -1) {
				embed.addField(`No items!`, `Page **${page}** doesn't have any items to display.`);
				break;
			}

			embed.addField(`**[${i}]** ${item.name} -- \$${item.price}`, item.description);
		}
		embed.setTimestamp();

		message.channel.send(embed);
	}
}