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
  toRadians,
  vec,
} from "excalibur";
import { Card, CARD_WIDTH, CardEvents } from "./card";
import {
  DAMAGE_TAKEN_EVENT,
  DECLARE_ATTACK_EVENT,
  GAME_END_EVENT,
  GAME_START_EVENT,
  GameBoard,
  PLAY_CARD_EVENT,
  TURN_END_EVENT,
  TURN_START_EVENT,
  UPDATE_PENDING_EVENT
} from "./game_board";
import { Enemy } from "./enemy";

const PLAYER_HAND_START_X = 200;
const PLAYER_HAND_START_Y = 500;

const PLAYER_DECK_START_X = 800;
const PLAYER_DECK_START_Y = 500;

const PLAYER_DISCARD_START_X = 925;
const PLAYER_DISCARD_START_Y = 500;

const PLAYER_HEALTH_START_X = 700;
const PLAYER_HEALTH_START_Y = 450;

const PLAYER_MANA_START_X = 700;
const PLAYER_MANA_START_Y = 525;

const PLAYER_BOARD_START_X = 145;
const PLAYER_BOARD_START_Y = 300;

const ENEMY_BOARD_START_X = 600;
const ENEMY_BOARD_START_Y = 300;

const ENEMY_HAND_START_X = 200;
const ENEMY_HAND_START_Y = 125;

const ENEMY_DECK_START_X = 800;
const ENEMY_DECK_START_Y = 100;

const ENEMY_DISCARD_START_X = 925;
const ENEMY_DISCARD_START_Y = 100;

const ENEMY_HEALTH_START_X = 700;
const ENEMY_HEALTH_START_Y = 150;

const ENEMY_MANA_START_X = 700;
const ENEMY_MANA_START_Y = 75;

const ENEMY_PORTRAIT_START_X = 870;
const ENEMY_PORTRAIT_START_Y = 225;

const SPACE_BETWEEN_CARDS = 25;

const UP_ARROW = "\u2191";
const DOWN_ARROW = "\u2193";

export class Duel extends Scene {
  private _gameBoard: GameBoard;
  private _enemy: Enemy;
  private _updatePending: boolean;

  private _turnArrow = new Label({
      text: "?",
      font: new Font({
          family: "Comic Sans MS",
          size: 72,
      }),
      color: Color.Gray,
      pos: vec(-160, -35)
  })
  private _turnMessage = new Label({
      font: new Font({
        textAlign: TextAlign.Center,
        family: "Comic Sans MS",
        size: 24
    }),
    pos: vec(25, 0)
  });
  private _declareAttack = new Label({
      text: "ATTACK!",
      font: new Font({
        textAlign: TextAlign.Center,
        family: "Comic Sans MS",
        size: 24,
        color: Color.Red,
    }),
    pos: vec(25, 55),
    visible: false,
  });
  private _endTurn = new Label({
    text: "End turn",
    font: new Font({
      textAlign: TextAlign.Center,
      family: "Comic Sans MS",
      size: 24,
      color: Color.White,
    }),
    pos: vec(25, 90)
  });
  private _gameOverMessage = new Label({
      text: "GAME OVER",
      font: new Font({
          textAlign: TextAlign.Center,
          family: "Comic Sans MS",
          size: 72,
          color: Color.White
      }),
      visible: false,
      z: 2
  })

  private _playerDeckLabel = new Label({
    text: "0",
    font: new Font({
      family: "Comic Sans MS",
      textAlign: TextAlign.Center,
      size: 24,
      color: Color.Magenta,
    }),
  });
  private _playerDiscardPileLabel = new Label({
    text: "0",
    font: new Font({
      family: "Comic Sans MS",
      textAlign: TextAlign.Center,
      size: 24,
      color: Color.Magenta,
    }),
  });
  private _playerHealthLabel = new Label({
    text: "0",
    font: new Font({
      family: "Comic Sans MS",
      textAlign: TextAlign.Center,
      baseAlign: BaseAlign.Middle,
      size: 18,
      color: Color.White,
    }),
    rotation: toRadians(-45)
  }); 
  private _playerManaLabel = new Label({
    text: "0",
    font: new Font({
      family: "Comic Sans MS",
      textAlign: TextAlign.Center,
      baseAlign: BaseAlign.Middle,
      size: 18,
      color: Color.Magenta,
    }),
  });

  private _enemyDeckLabel = new Label({
    text: "0",
    font: new Font({
      family: "Comic Sans MS",
      textAlign: TextAlign.Center,
      size: 24,
      color: Color.Magenta,
    }),
  });
  private _enemyDiscardPileLabel = new Label({
    text: "0",
    font: new Font({
      family: "Comic Sans MS",
      textAlign: TextAlign.Center,
      size: 24,
      color: Color.Magenta,
    }),
  });
  private _enemyHealthLabel = new Label({
    text: "0",
    font: new Font({
      family: "Comic Sans MS",
      textAlign: TextAlign.Center,
      baseAlign: BaseAlign.Middle,
      size: 18,
      color: Color.White,
    }),
    rotation: toRadians(-45)
  });
  private _enemyManaLabel = new Label({
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
    this._updatePending = false;
  }

  override onInitialize(engine: Engine): void {
    this.add(this._turnMessage);
    this.add(this._gameBoard);
    this.add(this._enemy);
    
    const title = new Actor({
        pos: vec(engine.screen.center.x / 2 + 525, engine.screen.center.y / 2 + 150)
    });
    title.addChild(this._turnArrow);
    title.addChild(this._turnMessage);
    title.addChild(this._declareAttack);
    title.addChild(this._endTurn);

    const playerDeck = new Actor({
      width: 100,
      height: 100,
      color: Color.Chartreuse,
      pos: vec(PLAYER_DECK_START_X, PLAYER_DECK_START_Y),
    }).addChild(this._playerDeckLabel);
    
    const playerDiscardPile = new Actor({
      width: 100,
      height: 100,
      color: Color.DarkGray,
      pos: vec(PLAYER_DISCARD_START_X, PLAYER_DISCARD_START_Y),
    }).addChild(this._playerDiscardPileLabel);

    const playerHealth = new Actor({
        width: 50,
        height: 50,
        rotation: toRadians(45),
        color: Color.Teal,
        pos: vec(PLAYER_HEALTH_START_X, PLAYER_HEALTH_START_Y),
    }).addChild(this._playerHealthLabel);

    const playerManaOrb = new Actor({
      radius: 24,
      color: Color.Orange,
      pos: vec(PLAYER_MANA_START_X, PLAYER_MANA_START_Y),
    }).addChild(this._playerManaLabel);

    const enemyDeck = new Actor({
      width: 100,
      height: 100,
      color: Color.Chartreuse,
      pos: vec(ENEMY_DECK_START_X, ENEMY_DECK_START_Y),
    }).addChild(this._enemyDeckLabel)
    
    const enemyDiscardPile = new Actor({
      width: 100,
      height: 100,
      color: Color.DarkGray,
      pos: vec(ENEMY_DISCARD_START_X, ENEMY_DISCARD_START_Y),
    }).addChild(this._enemyDiscardPileLabel);

    const enemyHealth = new Actor({
      width: 50,
      height: 50,
      rotation: toRadians(45),
      color: Color.Red,
      pos: vec(ENEMY_HEALTH_START_X, ENEMY_HEALTH_START_Y),
    }).addChild(this._enemyHealthLabel);

    const enemyManaOrb = new Actor({
      radius: 24,
      color: Color.Orange,
      pos: vec(ENEMY_MANA_START_X, ENEMY_MANA_START_Y),
    }).addChild(this._enemyManaLabel);

    const enemySprite = this._enemy.sprite;
    enemySprite.scale = vec(0.075, 0.075);
 
    const enemyPortrait = new Actor({
        z: 1,
        pos: vec(ENEMY_PORTRAIT_START_X, ENEMY_PORTRAIT_START_Y)
    });
    enemyPortrait.graphics.use(enemySprite);
    
    const playersHandMessage = new Label({
      text: "Your hand:",
      pos: vec(PLAYER_HAND_START_X - 65, PLAYER_HAND_START_Y - 110),
    });
    const playerDeckMessage = new Label({
      text: "Your Deck",
      pos: vec(PLAYER_DECK_START_X - 25, PLAYER_DECK_START_Y - 65),
    });
     const playerDiscardPileMessage = new Label({
      text: "Your Discard Pile",
      pos: vec(PLAYER_DISCARD_START_X - 40, PLAYER_DISCARD_START_Y - 65),
    });

    const enemyHandMessage = new Label({
      text: "Enemy hand:",
      pos: vec(ENEMY_HAND_START_X - 50, ENEMY_HAND_START_Y - 110),
    });
    const enemyDeckMessage = new Label({
      text: "Enemy Deck",
      pos: vec(ENEMY_DECK_START_X - 25, ENEMY_DECK_START_Y - 65),
    });
     const enemyDiscardPileMessage = new Label({
      text: "Enemy Discard Pile",
      pos: vec(ENEMY_DISCARD_START_X - 45, ENEMY_DISCARD_START_Y - 65),
    });

    this.add(title);
   
    this.add(playersHandMessage);
    this.add(playerDeckMessage);
    this.add(playerDiscardPileMessage);

    this.add(playerDeck);
    this.add(playerDiscardPile);
    this.add(playerHealth);
    this.add(playerManaOrb);

    this.add(enemyHandMessage);
    this.add(enemyDeckMessage);
    this.add(enemyDiscardPileMessage);

    this.add(enemyDeck);
    this.add(enemyDiscardPile);
    this.add(enemyHealth);
    this.add(enemyManaOrb);
    
    this.add(enemyPortrait);
   
    this._endTurn.on("pointerdown", (_evt) => {
        const gameTurn = this._gameBoard.turn;
        if (gameTurn === "PLAYER") this.emit(TURN_END_EVENT, { entity: "PLAYER" });
    });
    this._declareAttack.on("pointerdown", (_evt) => {
        const gameTurn = this._gameBoard.turn;
        if (gameTurn === "PLAYER" && this._declareAttack.graphics.isVisible) this.emit(DECLARE_ATTACK_EVENT, { entity: "PLAYER" });
    });

    this.add(this._endTurn);
    this.add(this._declareAttack);

    this.events.on(GAME_END_EVENT, (e: any) => {
        if(e.winner === "PLAYER") {
            this._gameOverMessage.text = "YOU WIN! You have defeated evil"
            this._gameOverMessage.graphics.color = Color.Green;
            this._gameOverMessage.graphics.isVisible = true;
            this._gameOverMessage.actions.moveTo(
                vec(engine.screen.center.x / 2 + 100, engine.screen.center.y / 2 + 150), 5000, EasingFunctions.EaseInOutQuad
            );
            
            this._turnMessage.graphics.isVisible = false;
            this._endTurn.graphics.isVisible = false;
            this._declareAttack.graphics.isVisible = false;
            this._turnArrow.graphics.isVisible = false;

            enemyPortrait.actions.fade(0, 2000)
            enemyPortrait.actions.callMethod(() => engine.stop());
        } else {
            this._gameOverMessage.text = "YOU LOSE! Evil has triumphed";
            this._gameOverMessage.graphics.color = Color.Red;
            this._gameOverMessage.graphics.isVisible = true;
            this._gameOverMessage.actions.moveTo(
                vec(engine.screen.center.x / 2, engine.screen.center.y / 2 + 100), 5000, EasingFunctions.EaseInOutQuad
            );

            this._turnMessage.graphics.isVisible = false;
            this._endTurn.graphics.isVisible = false;
            this._declareAttack.graphics.isVisible = false;
            this._turnArrow.graphics.isVisible = false;

            enemyPortrait.pos = vec(engine.screen.center.x / 2 + 50, engine.screen.center.y / 2 + 150);
            enemyPortrait.actions.scaleTo(vec(5, 5), vec(0.5, 0.5));
            enemyPortrait.actions.callMethod(() => engine.stop());
        }
    })

    this.add(this._gameOverMessage);
    
    this.on(UPDATE_PENDING_EVENT, (_evt) =>
        this._updatePending = true
    );
    this.on(DAMAGE_TAKEN_EVENT, (evt: any) => {
        if(evt.entity === "PLAYER") this._playerHealthLabel.actions.blink(250, 250, 2);
        else this._enemyHealthLabel.actions.blink(250, 250, 2);
    })
  }

  addCardToBoard(card: Card) {
    this.emit(PLAY_CARD_EVENT, { entity: "PLAYER", card: card });
  }

  override onPreLoad(loader: DefaultLoader): void {
    // Add any scene specific resources to load
  }

  override onActivate(context: SceneActivationContext<unknown>): void {
    this.emit(GAME_START_EVENT);
    this.emit(TURN_START_EVENT, { entity: "PLAYER" });
  }

  override onDeactivate(context: SceneActivationContext): void {
    // Called when Excalibur transitions away from this scene
    // Only 1 scene is active at a time
  }

  override onPreUpdate(engine: Engine, elapsedMs: number): void {
    const gameTurn = this._gameBoard.turn;
    const isPlayerTurn = gameTurn === "PLAYER";

    if (gameTurn === "PLAYER") {
      this._turnMessage.text = "Your move, gamer.";
      this._turnArrow.text = UP_ARROW;
      this._turnArrow.graphics.color = Color.Teal;
    } else {
      this._turnMessage.text = this._enemy.currentState();
      this._turnArrow.text = DOWN_ARROW;
      this._turnArrow.graphics.color = Color.Red; 
    }

    const canAttack = this._gameBoard.playerBoard.length > 0 && this._gameBoard.turn === "PLAYER" && !this._gameBoard.hasAttackedThisTurn;
    this._declareAttack.graphics.isVisible = canAttack;

    this._playerDeckLabel.text = this._gameBoard.playerDeck.length.toString();
    this._playerDiscardPileLabel.text = this._gameBoard.playerDiscard.length.toString();
    this._playerHealthLabel.text = this._gameBoard.playerHealth.toString();
    this._playerManaLabel.text = this._gameBoard.playerMana.toString();

    this._enemyDeckLabel.text = this._gameBoard.enemyDeck.length.toString();
    this._enemyDiscardPileLabel.text = this._gameBoard.enemyDiscard.length.toString();
    this._enemyHealthLabel.text = this._gameBoard.enemyHealth.toString();
    this._enemyManaLabel.text = this._gameBoard.enemyMana.toString();

    if (!this._updatePending) return;

    const numCardsInPlayerHand = this._gameBoard.playerHand.length;
    this._gameBoard.playerHand.forEach((card, index) => {
      const cardPos = vec(
        PLAYER_HAND_START_X +
          (CARD_WIDTH * index +
            numCardsInPlayerHand +
            SPACE_BETWEEN_CARDS * index +
            numCardsInPlayerHand),
        PLAYER_HAND_START_Y,
      );
      
      const isOverlapped = index === numCardsInPlayerHand - 1;
      card.setOverlapped(isOverlapped);

      card.off(CardEvents.Pressed);
      card.events.on(CardEvents.Pressed, () => {
        if(isPlayerTurn) this.emit(PLAY_CARD_EVENT, { entity: "PLAYER", card });
      });
      card.actions.clearActions();
      card.actions.moveTo(cardPos, 500, EasingFunctions.EaseInOutCubic);
      this.add(card);
    });

    const numCardsInEnemyHand = this._gameBoard.enemyHand.length;
    this._gameBoard.enemyHand.forEach((card, index) => {
      const cardPos = vec(
        ENEMY_HAND_START_X +
          (CARD_WIDTH * index +
            numCardsInEnemyHand +
            SPACE_BETWEEN_CARDS * index +
            numCardsInEnemyHand),
        ENEMY_HAND_START_Y,
      );
      card.actions.clearActions();
      card.actions.moveTo(cardPos, 500, EasingFunctions.EaseInOutCubic);
      this.add(card);
    });

    const numCardsOnPlayerBoard = this._gameBoard.playerBoard.length;
    this._gameBoard.playerBoard.forEach((card, index) => {
      const cardPos = vec(
        PLAYER_BOARD_START_X +
          (CARD_WIDTH * index +
            numCardsOnPlayerBoard +
            SPACE_BETWEEN_CARDS * index +
            numCardsOnPlayerBoard),
        PLAYER_BOARD_START_Y,
      );
      card.actions.clearActions();
      card.actions.moveTo(cardPos, 250, EasingFunctions.EaseInCubic);
      this.add(card);
    });

    const numCardsOnEnemyBoard = this._gameBoard.enemyBoard.length;
    this._gameBoard.enemyBoard.forEach((card, index) => {
      const cardPos = vec(
        ENEMY_BOARD_START_X -
          (CARD_WIDTH * index +
            numCardsOnEnemyBoard +
            SPACE_BETWEEN_CARDS * index +
            numCardsOnEnemyBoard),
        ENEMY_BOARD_START_Y,
      );
      card.actions.clearActions();
      card.actions.moveTo(cardPos, 250, EasingFunctions.EaseInCubic);
      this.add(card);
    });

    this._updatePending = false;
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
