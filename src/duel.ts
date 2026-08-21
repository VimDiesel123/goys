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
import { Card, CARD_WIDTH, CardEvents, CardData } from "./card";
import { Hand } from "./hand";
import { ScreenCard } from "./ui";

const goblinData: CardData = {
  name: "Goblin",
  manaCost: 1,
  power: 1,
  toughness: 1,
  portrait: "goblin",
  type: "red",
};
const wizardData: CardData = {
  name: "Wizard",
  manaCost: 2,
  power: 2,
  toughness: 2,
  portrait: "wizard",
  type: "blue",
  effect: "Tap to deal 1 damage to any target. Tap to deal 1 damage to any target.",
};

type Turn = "player" | "enemy";
const PLAYER_HAND_START_X = 100;
const PLAYER_HAND_START_Y = 400;
const PLAYERS_CARDS: Card[] = [
  new Card(goblinData),
  new Card(wizardData),
  new Card(goblinData),
];

export class Duel extends Scene {
  private _currentTurn: Turn = "player";
  private _playersHand: Hand;
  private _turnMessage: Label;

  constructor() {
    super();
    this._playersHand = new Hand(
      PLAYERS_CARDS,
      vec(PLAYER_HAND_START_X, PLAYER_HAND_START_Y),
    );
    this._turnMessage = new Label({
      pos: vec(100, 100),
      font: new Font({ family: "Comic Sans MS", size: 64 }),
    });
  }

  override onInitialize(engine: Engine): void {
    this.add(this._turnMessage);
    const playersHandMessage = new Label({
      text: "Your hand:",
      pos: vec(PLAYER_HAND_START_X, PLAYER_HAND_START_Y - 100),
    });
    this.add(playersHandMessage);
    this.add(this._playersHand);
    this._playersHand.Cards.forEach((card) =>
      card.events.on(CardEvents.Pressed, () => {
        console.log("Here");
        this.addCardToBoard();
        this.passTurn();
      }),
    );
  }

  passTurn() {
    this._currentTurn = this._currentTurn == "player" ? "enemy" : "player";
  }

  addCardToBoard() { }

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
    this._turnMessage.text =
      this._currentTurn == "player"
        ? "Your move, gamer."
        : "Everything is are already in motion...";
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
