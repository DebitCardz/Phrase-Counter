import { Prop } from "@typegoose/typegoose";

export type Dictonary <T> = {
	[key: string]: T
}

export class Gamer {
	@Prop()
	user_id!: string;

	@Prop()
	cash!: number;

	@Prop()
	inventory!: string[];

	@Prop()
	phrases!: Dictonary<number>;
}