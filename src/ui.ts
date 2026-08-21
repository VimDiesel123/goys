import { Card, CardEvents } from "./card";
import { Portraits, Frames, Banners, Borders, Plaques, Resources } from "./resources";

const template = document.querySelector<HTMLTemplateElement>("#hand-card-template");
const hand = document.getElementById("hand");

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

    constructor(card: Card) {
        this.card = card;
        const fragment = template!.content.cloneNode(true) as DocumentFragment;
        const rootElement = fragment.querySelector<HTMLElement>(".hand-card");

        if (!rootElement || !hand) {
            throw Error('Failed to initialize card.');
        }

        this.rootElement = rootElement;
        const nameElement = rootElement.querySelector<HTMLElement>(".hand-card__name");
        const statElement = rootElement.querySelector<HTMLElement>(".hand-card__stats");
        const manaElement = rootElement.querySelector<HTMLElement>(".hand-card__mana-cost");
        const effectElement = rootElement.querySelector<HTMLElement>(".hand-card__effect-text");
        const portraitElement = rootElement.querySelector<HTMLElement>(".hand-card__portrait");
        const frameElement = rootElement.querySelector<HTMLElement>(".hand-card__frame");
        const borderElement = rootElement.querySelector<HTMLElement>(".hand-card__border");
        const bannerElement = rootElement.querySelector<HTMLElement>(".hand-card__banner");
        const plaqueElement = rootElement.querySelector<HTMLElement>(".hand-card__plaque");


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
        const portraitURL = Portraits.get(this.card.portrait)?.path ?? Resources.DefaultPortrait.path;
        const bannerURL = Banners.get(this.card.type)?.path ?? Resources.DefaultBanner.path;
        const borderURL = Borders.get(this.card.type)?.path ?? Resources.DefaultBorder.path;
        const frameURL = Frames.get(this.card.type)?.path ?? Resources.DefaultFrame.path;
        const plaqueURL = Plaques.get(this.card.type)?.path ?? Resources.DefaultPlaque.path;
        console.log(this.card.type)
        console.log(portraitURL);
        this.portraitElement.style.backgroundImage = `url(${portraitURL})`;
        this.bannerElement.style.backgroundImage = `url(${bannerURL})`;
        this.borderElement.style.backgroundImage = `url(${borderURL})`;
        this.frameElement.style.backgroundImage = `url(${frameURL})`;
        this.plaqueElement.style.backgroundImage = `url(${plaqueURL})`;
        this.rootElement.style.setProperty('visibility', 'visible');
        this.rootElement.style.setProperty('--hover-color', 'rgba(0, 255, 0, 0.67)');

        this.rootElement.addEventListener('click', e => {
            this.card.events.emit(CardEvents.Pressed);
        })

        hand.appendChild(this.rootElement);
    }
}