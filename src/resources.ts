import { ImageSource, Loader, Font, FontUnit, Color, TextAlign, vec } from "excalibur";

// It is convenient to put your resources in one place
export const Resources = {
  BirdImage: new ImageSource("./images/sword.png"),
  DefaultPortrait: new ImageSource("./images/goblin.jpg"),
  DefaultFrame: new ImageSource("./images/red_frame.webp"),
  DefaultBanner: new ImageSource("./images/red_banner.webp"),
  DefaultBorder: new ImageSource("./images/red_border.webp"),
  DefaultPlaque: new ImageSource("./images/red_plaque.webp"),
  RedCardFrame: new ImageSource("./images/red_frame.webp"),
  RedCardBanner: new ImageSource("./images/red_banner.webp"),
  RedCardBorder: new ImageSource("./images/red_border.webp"),
  RedCardPlaque: new ImageSource("./images/red_plaque.webp"),
  BlueCardFrame: new ImageSource("./images/blue_frame.webp"),
  BlueCardBanner: new ImageSource("./images/blue_banner.webp"),
  BlueCardBorder: new ImageSource("./images/blue_border.webp"),
  BlueCardPlaque: new ImageSource("./images/blue_plaque.webp"),
  CardMana: new ImageSource("./images/mana.webp"),
  CardAttack: new ImageSource("./images/attack.webp"),
  EnemyImage: new ImageSource("./images/enemy.webp"),
  GoblinImage: new ImageSource("./images/goblin.jpg"),
  WizardImage: new ImageSource("./images/wizard.jpg"),
} as const; // the 'as const' is a neat typescript trick to get strong typing on your resources. 
// So when you type Resources.Sword -> ImageSource

export const Portraits = new Map<string, ex.ImageSource>([
  ["goblin", Resources.GoblinImage],
  ["wizard", Resources.WizardImage],
]);

export const Frames = new Map<string, ex.ImageSource>([
  ["red", Resources.RedCardFrame],
  ["blue", Resources.BlueCardFrame],
]);


export const Banners = new Map<string, ex.ImageSource>([
  ["red", Resources.RedCardBanner],
  ["blue", Resources.BlueCardBanner],
]);

export const Borders = new Map<string, ex.ImageSource>([
  ["red", Resources.RedCardBorder],
  ["blue", Resources.BlueCardBorder],
]);

export const Plaques = new Map<string, ex.ImageSource>([
  ["red", Resources.RedCardPlaque],
  ["blue", Resources.BlueCardPlaque],
]);

export const NameFont = new Font({
  size: 16,
  unit: FontUnit.Px,
  family: "sans-serif",
  color: Color.White,
  bold: true,
  textAlign: TextAlign.Center,
  //baseAlign: BaseAlign.Middle,
  shadow: {
    blur: 2,
    offset: vec(2, 2),
    color: Color.Black,
  },
});

// We build a loader and add all of our resources to the boot loader
// You can build your own loader by extending DefaultLoader
export const loader = new Loader();
for (const res of Object.values(Resources)) {
  loader.addResource(res);
}
