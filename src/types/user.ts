import { Prop } from "@typegoose/typegoose";
// import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";

export type Dictonary <T> = {
	[key: string]: T
}

// Removed because this was moved to a variable instead of 
// being stored in the database.
// type Cooldown <T> = {
	// [key: string]: T
// }

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