import ShopItem from "../types/shopitem";

const config = require("../../config.json");

export class Shop {

	// double the fun.
	public items: ShopItem[][] = [];

	constructor() {
		for(const pageIndex in config.shop)  
			this.items.push(config.shop[pageIndex]);
	}

	/**
	 * Get the desired items in a catalog page.
	 * @param page
	 */
	public getCatalogPage(page: number) : ShopItem[] {
		// If the page is not created return an invalid item,
		// should possibly add error handling so empty arrays don't get sent through?
		// But it's most likely not needed since shop pages are created in the config.json so as long as
		// I don't do something stupid this should be fineeeee.
		return this.items[page] ? this.items[page] : [{ name: "", description: "", "price": -1 }];
	}	
}