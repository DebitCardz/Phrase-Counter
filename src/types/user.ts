import { Prop } from "@typegoose/typegoose";
// import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";

export type Dictonary <T> = {
	[key: string]: T
}

type Cooldown <T> = {
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

	@Prop()
	cooldown!: Cooldown<number>;
}