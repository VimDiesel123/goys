import {
  Actor,
  DefaultLoader,
  Engine,
  ExcaliburGraphicsContext,
  Font,
  Label,
  Scene,
  SceneActivationContext,
  vec,
  Vector,
} from "excalibur";
import { Card, CARD_WIDTH, CardEvents } from "./card";

type Turn = "player" | "enemy";
const _playerHandStartX = 100;
const _playerHandStartY = 500;

export class Duel extends Scene {
  private _currentTurn: Turn = "player";

  private _playersHand: Card[] = [
    new Card("Goblin", vec(_playerHandStartX, _playerHandStartY + 20)),
    new Card(
      "Monster",
      vec(_playerHandStartX + CARD_WIDTH + 25, _playerHandStartY + 20),
    ),
    new Card(
      "Ghoul",
      vec(_playerHandStartX + CARD_WIDTH * 2 + 50, _playerHandStartY + 20),
    ),
  ];

  override onInitialize(engine: Engine): void {
    console.log("Initializing scene");
    const turnMessage = new Label({
      text:
        this._currentTurn == "player"
          ? "Your move, gamer."
          : "Everything is are already in motion...",
      pos: vec(100, 100),
      font: new Font({ family: "Comic Sans MS", size: 64 }),
    });
    this.add(turnMessage);

    const playersHandMessage = new Label({
      text: "Your hand:",
      pos: vec(_playerHandStartX, _playerHandStartY - 100),
    });
    this.add(playersHandMessage);
    this._playersHand.forEach((card) => this.add(card));
    this._playersHand.forEach((card) =>
      card.events.on(CardEvents.Pressed, () =>
        console.log("A card was pressed"),
      ),
    );
  }

  override onPreLoad(loader: DefaultLoader): void {
    // Add any scene specific resources to load
  }

  override onActivate(context: SceneActivationContext<unknown>): void {
    // Called when Excalibur transitions to this scene
    // Only 1 scene is active at a time
  }

  override onDeactivate(context: SceneActivationContext): void {
    // Called when Excalibur transitions away from this scene
    // Only 1 scene is active at a time
  }

  override onPreUpdate(engine: Engine, elapsedMs: number): void {
    // Called before anything updates in the scene
  }

  override onPostUpdate(engine: Engine, elapsedMs: number): void {
    // Called after everything updates in the scene
  }

  override onPreDraw(ctx: ExcaliburGraphicsContext, elapsedMs: number): void {
    // Called before Excalibur draws to the screen
  }

  override onPostDraw(ctx: ExcaliburGraphicsContext, elapsedMs: number): void {
    // Called after Excalibur draws to the screen
  }
}
