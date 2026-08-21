import { Card } from "./card";
import { Portraits, Frames, Banners, Borders, Plaques } from "./resources";

export class ScreenCard {
    rootElement: HTMLElement;
    nameElement: HTMLElement;
    statElement: HTMLElement;
    manaElement: HTMLElement;
    effectElement: HTMLElement;
    portraitElement: HTMLElement;
    frameElement: HTMLElement;
    bannerElement: HTMLElement;
    borderElement: HTMLElement;
    plaqueElement: HTMLElement;
    card: Card;
    canPlay: boolean;

    constructor(card: Card) {
        this.card = card;

        const rootElement = document.getElementById("hand-card");
        const nameElement = document.getElementById("hand-card__name");
        const statElement = document.getElementById("hand-card__stats");
        const manaElement = document.getElementById("hand-card__mana-cost");
        const effectElement = document.getElementById("hand-card__effect-text");
        const portraitElement = document.getElementById("hand-card__portrait");
        const frameElement = document.getElementById("hand-card__frame");
        const borderElement = document.getElementById("hand-card__border");
        const bannerElement = document.getElementById("hand-card__banner");
        const plaqueElement = document.getElementById("hand-card__plaque");


        if (rootElement && nameElement && statElement && manaElement
            && effectElement && portraitElement && frameElement &&
            borderElement && bannerElement && plaqueElement) {
            this.rootElement = rootElement;
            this.nameElement = nameElement;
            this.statElement = statElement;
            this.manaElement = manaElement;
            this.effectElement = effectElement;
            this.portraitElement = portraitElement;
            this.frameElement = frameElement;
            this.borderElement = borderElement;
            this.bannerElement = bannerElement;
            this.plaqueElement = plaqueElement;
        }
        else {
            throw Error('Failed to initialize card.');
        }

        this.nameElement.innerHTML = card.name;
        this.manaElement.innerHTML = card.manaCost.toString();
        this.statElement.innerHTML = card.power.toString() + " / " + card.toughness.toString();
        this.effectElement.innerHTML = card.effect ? card.effect : "";
        this.portraitElement.style.backgroundImage = `url(${Portraits[this.card.portrait].path})`;
        this.bannerElement.style.backgroundImage = `url(${Banners[this.card.type].path})`;
        this.borderElement.style.backgroundImage = `url(${Borders[this.card.type].path})`;
        this.frameElement.style.backgroundImage = `url(${Frames[this.card.type].path})`;
        this.plaqueElement.style.backgroundImage = `url(${Plaques[this.card.type].path})`;
        this.canPlay = true;
        document.documentElement.style.setProperty('--hover-color', 'rgba(0, 255, 0, 0.67)');
    }
}