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

  constructor(name: string) {
    super({
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

  public setPosition(position: Vector) {
    this.pos = position;
  }

  onInitialize(engine: Engine): void {
    this.addChild(this._label);
    this.events.on("pointerdown", () => {
      console.log("Card pressed");
      this.events.emit(CardEvents.Pressed);
    });
  }
}
