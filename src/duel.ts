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
import { Hand } from "./hand";
import { GAME_START_EVENT, GameBoard, PLAY_CARD_EVENT } from "./game_board";

type Turn = "player" | "enemy";
const PLAYER_HAND_START_X = 100;
const PLAYER_HAND_START_Y = 400;
const PLAYERS_CARDS: Card[] = [
  new Card("Goblin"),
  new Card("Monster"),
  new Card("Ghoul"),
];

export class Duel extends Scene {
  private _currentTurn: Turn = "player";
  private _playersHand: Hand;
  private _turnMessage: Label;
  private _gameBoard: GameBoard;

  constructor() {
    super();
    this._gameBoard = new GameBoard();
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
    this.add(this._gameBoard);
    
    const playersHandMessage = new Label({
      text: "Your hand:",
      pos: vec(PLAYER_HAND_START_X, PLAYER_HAND_START_Y - 100),
    });
    this.add(playersHandMessage);
    this.add(this._playersHand);
    this._playersHand.Cards.forEach((card) =>
      card.events.on(CardEvents.Pressed, () => {
        console.log("Here");
        this.addCardToBoard(card);
        this.passTurn();
      }),
    );
  }

  passTurn() {
    this._currentTurn = this._currentTurn == "player" ? "enemy" : "player";
  }

  addCardToBoard(card: Card) {
      this.emit(PLAY_CARD_EVENT, { entity: 'PLAYER', card: card });
  }

  override onPreLoad(loader: DefaultLoader): void {
    // Add any scene specific resources to load
  }

  override onActivate(context: SceneActivationContext<unknown>): void {
    this.emit(GAME_START_EVENT);
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
