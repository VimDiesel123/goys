import {
  Actor,
  Color,
  Engine,
  Font,
  Label,
  TextAlign,
  Vector,
} from "excalibur";

export const CARD_WIDTH = 80;

export const CardEvents = {
  Pressed: "cardpressed",
};

export class Card extends Actor {
  private readonly _label: Label;

  constructor(name: string) {
    super({
      width: 80,
      height: 80,
      color: Color.Chartreuse,
      // ew
      x: 850,
      y: 500,
    });

    this._label = new Label({
      text: name,
      font: new Font({
        family: "Comic Sans MS",
        textAlign: TextAlign.Center,
        size: 16,
        color: Color.Magenta,
      }),
    });
  }

  public setPosition(position: Vector) {
    this.pos = position;
  }

  public moveToBoard() {
      this.color = Color.Red;
      this._label.color = Color.White;
  }

  onInitialize(engine: Engine): void {
    this.addChild(this._label);
    this.events.on("pointerdown", () => {
      console.log("Card pressed");
      this.events.emit(CardEvents.Pressed, { card: this });
    });
  }
}
