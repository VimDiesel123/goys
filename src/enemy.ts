import * as ex from 'excalibur';
import { Card } from "./card";
import { Resources } from "./resources"
import { DECLARE_ATTACK_EVENT, DRAW_CARD_EVENT, GameBoard, PLAY_CARD_EVENT, TURN_END_EVENT, TURN_START_EVENT } from './game_board';

const ENEMY_TURN_START = "ENEMY_TURN_START";
const ENEMY_TURN_END = "ENEMY_TURN_END";

const ENEMY_DRAW_START = "ENEMY_DRAW_START";
const ENEMY_DRAW_END = "ENEMY_DRAW_END";

const ENEMY_MAIN_START = "ENEMY_MAIN_START";
const ENEMY_MAIN_END = "ENEMY_MAIN_END";

const ENEMY_ATTACK_START = "ENEMY_ATTACK_START";
const ENEMY_ATTACK_END = "ENEMY_ATTACK_END";

const PLAYER_TURN = "PLAYER_TURN";

const MS_BETWEEN_MOVES = 600;

class EnemyStateMachine { 
    private _entity: Enemy;
    private _currentState: string;
    private _previousState = "";
    private msSinceLastMove = 0;

    constructor(entity: Enemy, initialState: string) {
        this._currentState = initialState;
        this._entity = entity;
    }

    changeState(newState: string) {
        this._previousState = this._currentState;
        this._currentState = newState;
    }

    handle(elapsed: number) {
        this.msSinceLastMove += elapsed;

        if(this._currentState === PLAYER_TURN) {
            console.log("Skipping - PLAYER TURN");
            return;
        }
        
        if (this.msSinceLastMove < MS_BETWEEN_MOVES) return;
        else this.msSinceLastMove = 0;

        console.log(`Handling ENEMY ${this._currentState}`);
        switch(this._currentState) {
            case ENEMY_TURN_START:
                this._previousState = this._currentState;
                this._currentState = ENEMY_DRAW_START
                break;
            case ENEMY_DRAW_START:
                this._entity.scene?.emit(DRAW_CARD_EVENT, { entity: 'ENEMY', numDraws: 1 });

                this._previousState = this._currentState;
                this._currentState = ENEMY_DRAW_END;
                break;
            case ENEMY_DRAW_END:
                this._previousState = this._currentState;
                this._currentState = ENEMY_MAIN_START;
                break;
            case ENEMY_MAIN_START:
                const mana = this._entity.mana;
                const hand = this._entity.hand;
                const playableCards = hand.filter((card) => card.manaCost <= mana);
                if(playableCards.length > 0) {
                    const randomCardIx = Math.floor(Math.random() * hand.length);
                    const randomCard = hand[randomCardIx];

                    this._entity.scene?.emit(PLAY_CARD_EVENT, { entity: "ENEMY", card: randomCard});
                } else {
                    this._previousState = this._currentState;
                    this._currentState = ENEMY_MAIN_END;
                }
                break;
            case ENEMY_MAIN_END:
                this._previousState = this._currentState;
                this._currentState = ENEMY_ATTACK_START;
            case ENEMY_ATTACK_START:
                this._entity.scene?.emit(DECLARE_ATTACK_EVENT, { entity: 'ENEMY'});
                
                this._previousState = this._currentState;
                this._currentState = ENEMY_ATTACK_END;
                break;
            case ENEMY_ATTACK_END:
                this._previousState = this._currentState;
                this._currentState = ENEMY_TURN_END;
                break;
            case ENEMY_TURN_END:
                this._entity.scene?.emit(TURN_END_EVENT, { entity: 'ENEMY' });
               
                this._previousState = this._currentState;
                this._currentState = PLAYER_TURN;
                break;
        }
    }

    get state(): string {
        return this._currentState;
    }
}

export class Enemy extends ex.Actor {
    private _fsm: EnemyStateMachine;
    private _gameBoard: GameBoard;
    
    public mana = 0;
    public hand: Card[] = [];
    public readonly sprite: ex.Sprite = Resources.EnemyImage.toSprite();

    constructor(gameBoard: GameBoard) {
        super();
        this._gameBoard = gameBoard;
        this._fsm = new EnemyStateMachine(this, PLAYER_TURN);
    }

    onInitialize(_engine: ex.Engine): void {
        this.scene?.events.on(TURN_START_EVENT, (data: any) => {
            if(data.entity === 'PLAYER') this._fsm.changeState(PLAYER_TURN);
        });
        this.scene?.events.on(TURN_END_EVENT, (data: any) => {
            if (data.entity === 'PLAYER') this._fsm.changeState(ENEMY_TURN_START);
        });
    } 

    onPreUpdate(_engine: ex.Engine, elapsed: number): void {
        this.mana = this._gameBoard.enemyMana;
        this.hand = this._gameBoard.enemyHand;
        this._fsm.handle(elapsed);
    }

    currentState(): string {
        return this._fsm.state;
    }
}

