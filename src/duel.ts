import {
  Actor,
  BaseAlign,
  Color,
  DefaultLoader,
  Engine,
  EasingFunctions,
  ExcaliburGraphicsContext,
  Font,
  Label,
  Scene,
  SceneActivationContext,
  TextAlign,
  vec,
} from "excalibur";
import { Card, CARD_WIDTH, CardEvents } from "./card";
import {
  GAME_START_EVENT,
  GameBoard,
  PLAY_CARD_EVENT,
  TURN_END_EVENT,
} from "./game_board";
import { Enemy } from "./enemy";

const PLAYER_HAND_START_X = 200;
const PLAYER_HAND_START_Y = 450;

const PLAYER_DECK_START_X = 850;
const PLAYER_DECK_START_Y = 500;

const PLAYER_MANA_START_X = 750;
const PLAYER_MANA_START_Y = 500;

const PLAYER_BOARD_START_X = 225;
const PLAYER_BOARD_START_Y = 300;

const SPACE_BETWEEN_CARDS = 25;

export class Duel extends Scene {
  private _gameBoard: GameBoard;
  private _enemy: Enemy;
  private _playerHand: Set<number>;
  private _playerBoard: Set<number>;

  private _endTurn = new Label({
    text: "End turn",
    font: new Font({
      family: "Comic Sans MS",
      textAlign: TextAlign.Center,
      size: 36,
      color: Color.White,
    }),
    pos: vec(350, 100),
  });
  private _turnMessage = new Label({
    pos: vec(100, 25),
    font: new Font({ family: "Comic Sans MS", size: 64 }),
  });
  private _deckLabel = new Label({
    text: "0",
    font: new Font({
      family: "Comic Sans MS",
      textAlign: TextAlign.Center,
      size: 24,
      color: Color.Magenta,
    }),
  });
  private _manaLabel = new Label({
    text: "0",
    font: new Font({
      family: "Comic Sans MS",
      textAlign: TextAlign.Center,
      baseAlign: BaseAlign.Middle,
      size: 18,
      color: Color.Magenta,
    }),
  });

  constructor() {
    super();
    const gameBoard = new GameBoard();
    this._gameBoard = gameBoard;
    this._enemy = new Enemy(gameBoard);
    this._playerHand = new Set();
    this._playerBoard = new Set();
  }

  override onInitialize(engine: Engine): void {
    this.add(this._turnMessage);
    this.add(this._gameBoard);
    this.add(this._enemy);

    const deck = new Actor({
      width: 100,
      height: 100,
      color: Color.Chartreuse,
      pos: vec(PLAYER_DECK_START_X, PLAYER_DECK_START_Y),
    }).addChild(this._deckLabel);

    const manaOrb = new Actor({
      radius: 30,
      color: Color.Orange,
      pos: vec(PLAYER_MANA_START_X, PLAYER_MANA_START_Y),
    }).addChild(this._manaLabel);

    const playerDeckMessage = new Label({
      text: "Your Deck",
      pos: vec(PLAYER_DECK_START_X - 25, PLAYER_DECK_START_Y - 65),
    });

    this.add(playerDeckMessage);
    this.add(deck);
    this.add(manaOrb);

    const playersHandMessage = new Label({
      text: "Your hand:",
      pos: vec(PLAYER_HAND_START_X - 25, PLAYER_HAND_START_Y - 65),
    });
    this.add(playersHandMessage);

    this._endTurn.on("pointerdown", (evt) => {
      console.log("PLAYER ended turn");
      this.emit(TURN_END_EVENT, { entity: "PLAYER" });
    });
    this.add(this._endTurn);
  }

  addCardToBoard(card: Card) {
    this.emit(PLAY_CARD_EVENT, { entity: "PLAYER", card: card });
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
    if (this._gameBoard.turn === "PLAYER") {
      this._turnMessage.text = "Your move, gamer.";
    } else {
      this._turnMessage.text = "Everything is already in motion...";
    }

    this._deckLabel.text = this._gameBoard.playerDeck.length.toString();
    this._manaLabel.text = this._gameBoard.playerMana.toString();

    const numCardsInHand = this._playerHand.size;
    const newHandCards = this._gameBoard.playerHand.filter(
      (c) => !this._playerHand.has(c.id),
    );
    newHandCards.forEach((card, index) => {
      const cardPos = vec(
        PLAYER_HAND_START_X +
          (CARD_WIDTH * index +
            numCardsInHand +
            SPACE_BETWEEN_CARDS * index +
            numCardsInHand),
        PLAYER_HAND_START_Y,
      );
      card.events.on(CardEvents.Pressed, () => {
        console.log("she goin");
        this.emit(PLAY_CARD_EVENT, { entity: "PLAYER", card });
      });
      this._playerHand.add(card.id);
      card.actions.moveTo(cardPos, 500, EasingFunctions.EaseInOutCubic);
      this.add(card);
    });

    const numCardsOnBoard = this._playerBoard.size;
    const newBoardCards = this._gameBoard.playerBoard.filter(
      (c) => !this._playerBoard.has(c.id),
    );
    newBoardCards.forEach((card, index) => {
      const cardPos = vec(
        PLAYER_BOARD_START_X +
          (CARD_WIDTH * index +
            numCardsOnBoard +
            SPACE_BETWEEN_CARDS * index +
            numCardsOnBoard),
        PLAYER_BOARD_START_Y,
      );

      card.actions.moveTo(cardPos, 250, EasingFunctions.EaseInCubic);
      card.moveToBoard();

      this._playerBoard.add(card.id);
      this.add(card);
    });
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
