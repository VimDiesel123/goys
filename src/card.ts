import {
  Actor,
  Color,
  Engine,
  Font,
  Label,
  TextAlign,
  Vector,
} from "excalibur";

export const CARD_WIDTH = 150;

export const CardEvents = {
  Pressed: "cardpressed",
};

export class Card extends Actor {
  private readonly _label: Label;

  constructor(name: string, position: Vector) {
    super({
      pos: position,
      width: 150,
      height: 150,
      color: Color.Chartreuse,
    });

    this._label = new Label({
      text: name,
      font: new Font({
        family: "Comic Sans MS",
        textAlign: TextAlign.Center,
        size: 24,
        color: Color.Magenta,
      }),
    });
  }

  onInitialize(engine: Engine): void {
    this.addChild(this._label);
    this.events.on("pointerdown", () => this.events.emit(CardEvents.Pressed));
  }
}
