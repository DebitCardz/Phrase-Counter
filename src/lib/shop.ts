import ShopItem from "../types/shopitem";

const config = require("../../config.json");

export class Shop {

	public items: ShopItem[][] = [];

	constructor() {
		for(const pageIndex in config.shop)  
			this.items.push(config.shop[pageIndex]);
	}

	public getCatalogPage(page: number) : ShopItem[] {
		return this.items[page] ? this.items[page] : [{ name: "", description: "", "price": -1 }];
	}	
}