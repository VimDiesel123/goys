import * as ex from "excalibur";
import { Card, CardData } from "./card";

// Events
export const GAME_START_EVENT = "START_GAME_EVENT";
export const GAME_END_EVENT = "GAME_END_EVENT";

export const TURN_START_EVENT = "TURN_START_EVENT";
export const TURN_END_EVENT = "TURN_END_EVENT";

export const UPDATE_MANA_EVENT = "UPDATE_MANA_EVENT";

export const DRAW_CARD_EVENT = "DRAW_CARD_EVENT";
export const PLAY_CARD_EVENT = "PLAY_CARD_EVENT";

export const DECLARE_ATTACK_EVENT = "DECLARE_ATTACK_EVENT";
export const UPDATE_HEALTH_EVENT = "UPDATE_HEALTH_EVENT";

export const UPDATE_PENDING_EVENT = "UPDATE_PENDING_EVENT";
export const DAMAGE_TAKEN_EVENT = "DAMAGE_TAKEN_EVENT";

// Globals
const MAX_HAND_SIZE = 5;

export class GameBoard extends ex.Actor { 
  public hasAttackedThisTurn: boolean;
  public turnNumber: number;
  public turn: "PLAYER" | "ENEMY" | "NONE";
  
  public playerHealth: number;
  public playerMana: number;
  public playerBoard: Card[];
  public playerDeck: Card[];
  public playerDiscard: Card[];
  public playerHand: Card[];

  public enemyHealth: number;
  public enemyMana: number;
  public enemyBoard: Card[];
  public enemyDeck: Card[];
  public enemyDiscard: Card[];
  public enemyHand: Card[];

  constructor() {
    super();

    this.turnNumber = 0;
    this.turn = "NONE";
    this.hasAttackedThisTurn = false;

    this.playerHealth = 0;
    this.enemyHealth = 0;

    this.playerMana = 0;
    this.enemyMana = 0;

    this.playerBoard = [];
    this.enemyBoard = [];

    this.playerDeck = [];
    this.enemyDeck = [];

    this.playerDiscard = [];
    this.enemyDiscard = [];

    this.playerHand = [];
    this.enemyHand = [];
  }

  startGame() {
    this.playerHealth = 20;
    this.enemyHealth = 20;

    this.playerDeck = this.buildDeck("PLAYER");
    this.enemyDeck = this.buildDeck("ENEMY");

    this.playerMana = 1;
    this.enemyMana = 1;

    this.turn = "PLAYER";
    this.turnNumber = 1;
    this.hasAttackedThisTurn = false;
  }

  onInitialize(_engine: ex.Engine): void {
    this.scene?.on(GAME_START_EVENT, () => {
      console.log("Starting game");
      this.startGame();

      console.log(
        this.playerHealth,
        this.enemyHealth,
        this.turn,
        this.turnNumber,
        this.playerDeck.length,
        this.enemyDeck.length,
      );
    });

    this.scene?.on(TURN_START_EVENT, (data: any) => {
      console.log(`${data.entity}'s ${this.turnNumber} TURN START`);
      this.turn = data.entity;
      this.hasAttackedThisTurn = false;
      this.emit(UPDATE_MANA_EVENT, {
        entity: data.entity,
        mana: 1 * this.turnNumber,
      });
      if (this.turnNumber === 1) {
        this.scene?.emit(DRAW_CARD_EVENT, { entity: data.entity, numDraws: 5 });
      } else {
        this.scene?.emit(DRAW_CARD_EVENT, { entity: data.entity, numDraws: 1 });
      }
    });

    this.scene?.on(TURN_END_EVENT, (data: any) => {
      console.log(`${data.entity}'s ${this.turnNumber} TURN END`);
      if (data.entity === "PLAYER") {
        this.scene?.emit(TURN_START_EVENT, { entity: "ENEMY" });
      } else {
        this.turnNumber += 1;
        this.scene?.emit(TURN_START_EVENT, { entity: "PLAYER" });
      }
    });

    this.on(UPDATE_MANA_EVENT, (data: any) => {
      this.updateMana(data.entity, data.mana);
    });

    this.on(UPDATE_HEALTH_EVENT, (data: any) => {
      this.updateHealth(data.entity, data.health);
      this.scene?.emit(DAMAGE_TAKEN_EVENT, { entity: data.entity });

      if (this.playerHealth === 0) {
        this.scene?.emit(GAME_END_EVENT, { winner: "ENEMY" });
      } else if (this.enemyHealth === 0) {
        this.scene?.emit(GAME_END_EVENT, { winner: "PLAYER" });
      }
    });

    this.scene?.on(DRAW_CARD_EVENT, (data: any) => {
      this.drawCards(data.entity, data.numDraws);
      this.scene?.emit(UPDATE_PENDING_EVENT);
    });

    this.scene?.on(PLAY_CARD_EVENT, (data: any) => {
      this.playCard(data.entity, data.card);
      this.scene?.emit(UPDATE_PENDING_EVENT);
    });

    this.scene?.on(DECLARE_ATTACK_EVENT, (data: any) => {
      this.hasAttackedThisTurn = true;
      this.attack(data.entity);
    });

    console.log("Game board ready");
  }

  shuffle(deck: Card[]) {
      for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        
        [deck[i], deck[j]] = [deck[j], deck[i]];
      }
      return deck;
  }

  buildDeck(entity) {
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
      effect: "Tap to deal 1 damage to any target.",
    };

    //Hacky: Should be use constant
    const cardPos = entity === "PLAYER" ? ex.vec(800, 500) : ex.vec(800, 100)
    const goblins = Array.from({ length: 10 }, () => new Card(goblinData, cardPos));
    const wizards = Array.from({ length: 10 }, () => new Card(wizardData, cardPos));
    const deck = [...goblins, ...wizards];
    return this.shuffle(deck);
  }

  draw(
    startingHand: Card[],
    deck: Card[],
    discard: Card[],
    numDraws: number,
  ): Card[][] {
    var hand = startingHand;
    for (let i = 0; i < numDraws; i++) 
    {
      const nextCard = deck.shift();

      if (!nextCard) {
        deck = this.shuffle(discard);
        discard = [];

        return this.draw(hand, deck, discard, numDraws - i);
      } else {
        if (hand.length > MAX_HAND_SIZE) {
          discard.push(nextCard);
        } else {
          hand.push(nextCard);
        }
      }
    }

    return [hand, deck, discard];
  }

  updateMana(entity: "PLAYER" | "ENEMY", value: number) {
    if (entity === "PLAYER") {
      console.log(`Updating PLAYER'S MANA: ${this.playerMana} => ${value}`);
      this.playerMana = value;
    } else {
      console.log(`Updating ENEMY'S MANA: ${this.enemyMana} => ${value}`);
      this.enemyMana = value;
    }
  }

  updateHealth(entity: "PLAYER" | "ENEMY", value: number) {
    if (entity === "PLAYER") {
      console.log(`Updating PLAYER'S HEALTH: ${this.playerHealth} => ${value}`);
      this.playerHealth = Math.max(value, 0);
    } else {
      console.log(`Updating ENEMY'S HEALTH: ${this.enemyHealth} => ${value}`);
      this.enemyHealth = Math.max(value, 0);
    }
  }

  drawCards(entity: "PLAYER" | "ENEMY", numDraws: number) {
    console.log(`Drawing ${numDraws} for ${entity}`);
    if (entity === "PLAYER") {
      const [hand, deck, discard] = this.draw(
        [...this.playerHand],
        [...this.playerDeck],
        [...this.playerDiscard],
        numDraws,
      );
      this.playerHand = hand;
      this.playerDeck = deck;
      this.playerDiscard = discard;
    } else {
      const [hand, deck, discard] = this.draw(
        [...this.enemyHand],
        [...this.enemyDeck],
        [...this.enemyDiscard],
        numDraws,
      );
      this.enemyHand = hand;
      this.enemyDeck = deck;
      this.enemyDiscard = discard;
    }
  }

  playCard(entity: "PLAYER" | "ENEMY", card: Card) {
    console.log(`${entity} playing ${card.name}`);
    if (entity === "PLAYER") {
      if (this.playerMana >= card.manaCost) {
        this.playerBoard.push(card);
        this.playerHand = this.playerHand.filter((c) => c !== card);
        this.emit(UPDATE_MANA_EVENT, {
          entity: "PLAYER",
          mana: this.playerMana - card.manaCost,
        });
      } else {
        console.log(`${entity} does not have enough mana to play ${card.name}`);
      }
    } else {
      if (this.enemyMana >= card.manaCost) {
        this.enemyBoard.push(card);
        this.enemyHand = this.enemyHand.filter((c) => c !== card);
        this.emit(UPDATE_MANA_EVENT, {
          entity: "ENEMY",
          mana: this.enemyMana - card.manaCost,
        });
      } else {
        console.log(`${entity} does not have enough mana to play ${card.name}`);
      }
    }
  }

  attack(entity: "PLAYER" | "ENEMY") {
    console.log(`${entity} is ATTACKING`);
    if (entity === "PLAYER") {
      this.playerBoard.forEach(card => {
        card.actions.clearActions();
        card.actions.rotateBy(Math.PI / 4, Math.PI, ex.RotationType.Clockwise);
        card.actions.easeTo(ex.vec(870, 225), 500, ex.EasingFunctions.EaseInCubic);
        card.actions.easeTo(card.pos, 100, ex.EasingFunctions.EaseInCubic);
        card.actions.rotateTo(0, Math.PI, ex.RotationType.CounterClockwise);
        card.actions.callMethod(() => {
            this.emit(UPDATE_HEALTH_EVENT, {
                entity: "ENEMY",
                health: this.enemyHealth - card.power,
            });
        });
      });

    } else {
       this.enemyBoard.forEach(card => {
          card.actions.clearActions();
          card.actions.easeTo(ex.vec(card.pos.x, card.pos.y + 100), 300, ex.EasingFunctions.EaseInCubic);
          card.actions.easeTo(card.pos, 100, ex.EasingFunctions.EaseInCubic);
          card.actions.callMethod(() => {
            this.emit(UPDATE_HEALTH_EVENT, {
                entity: "PLAYER",
                health: this.playerHealth - card.power,
            });
        });
      }); 
    }
  }
}
