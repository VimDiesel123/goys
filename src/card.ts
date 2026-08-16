import {
  Actor,
  Color,
  Engine,
  Vector,
  Sprite,
  vec,
  Text,
  GraphicsGroup
} from "excalibur";
import { Resources, Portraits, Frames, Borders, Banners, NameFont } from './resources';

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
    const portrait = new Sprite({
      image: Portraits[this.portrait],
      scale: vec(0.25, 0.25),
    });
    const frame = new Sprite({
      image: Frames[this.type],
      scale: vec(0.25, 0.25),
    });
    const border = new Sprite({
      image: Borders[this.type],
      scale: vec(0.25, 0.25),
    });
    const banner = new Sprite({
      image: Banners[this.type],
      scale: vec(0.25, 0.25),
    });
    const mana = new Sprite({
      image: Resources.CardMana,
      scale: vec(0.5, 0.5),
    });
    var name = new Text({
      text: this.name,
      font: NameFont,
    });
    var manaCost = new Text({
      text: this.manaCost.toString(),
      font: NameFont,
    });
    const stats = new Text({
      text: this.power.toString() + " / " + this.toughness.toString(),
      font: NameFont,
    });
    const manaBadge = new GraphicsGroup({
      useAnchor: true,
      members: [
        {
          graphic: mana,
          offset: vec(0, 0),
        },
        {
          graphic: manaCost,
          offset: vec(mana.width / 2 - 2, mana.height / 2 - 9),
          useBounds: false
        },
      ],
    });
    const group = new GraphicsGroup({
      useAnchor: true, // position group from the top left
      members: [
        {
          graphic: portrait,
          offset: vec(frame.width / 2 - portrait.width / 2, 15),
        },
        {
          graphic: frame,
          offset: vec(0, 0),
        },
        {
          graphic: border,
          offset: vec(frame.width / 2 - border.width / 2, 20),
        },
        {
          graphic: banner,
          offset: vec(frame.width / 2 - banner.width / 2, 0),
        },
        {
          graphic: name,
          offset: vec(frame.width / 2, 6),
        },
        {
          graphic: manaBadge,
          offset: vec(-manaBadge.width / 4, -manaBadge.height / 4),
        },
        {
          graphic: stats,
          offset: vec(
            frame.width - stats.width,
            frame.height - stats.height - 18,
          ),
        },
      ],
    });
    this.graphics.use(group);
    this.events.on("pointerdown", () => {
      console.log("Card pressed");
      this.events.emit(CardEvents.Pressed);
    });
  }
}
