import {
  Actor,
  Color,
  Engine,
  Vector,
} from "excalibur";

export const CARD_WIDTH = 150;

export const CardEvents = {
  Pressed: "cardpressed",
};

export interface CardData {
  name: string;
  manaCost: number;
  power: number;
  toughness: number;
  portrait: string;
  type: string;
  effect?: string;
}

export class Card extends Actor {
  public name: string;
  public manaCost: number;
  public power: number;
  public toughness: number;
  public portrait: string;
  public type: string;
  public effect?: string;

  constructor(data: CardData) {
    super({
      width: 150,
      height: 150,
      color: Color.Chartreuse,
    });
    this.name = data.name;
    this.manaCost = data.manaCost;
    this.power = data.power;
    this.toughness = data.toughness;
    this.portrait = data.portrait;
    this.type = data.type;
    this.effect = data.effect;
  }

  public setPosition(position: Vector) {
    this.pos = position;
  }

  onInitialize(engine: Engine): void {
    this.events.on("pointerdown", () => {
      console.log("Card pressed");
      this.events.emit(CardEvents.Pressed);
    });
  }
}
