import { Actor, Color, vec, Vector } from "excalibur";
import { Card, CARD_WIDTH } from "./card";

const SPACE_BETWEEN_CARDS = 25;

export class Hand extends Actor {
  public Cards: Card[];

  constructor(cards: Card[], position: Vector) {
    super({
      pos: position,
      color: Color.Red,
    });
    this.Cards = cards;
    this.Cards.forEach((card) => this.addChild(card));
    this.Cards.forEach((card, index) =>
      card.setPosition(
        vec(position.x + CARD_WIDTH * index + SPACE_BETWEEN_CARDS * index, 0),
      ),
    );
  }
}
