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

export class MyLevel extends Scene {
  override onInitialize(engine: Engine): void {
    console.log("Initializing scene");
    const label = new Label({
      text: "Your move, gamer.",
      pos: vec(100, 100),
      font: new Font({ family: "comic sans", size: 64 }),
    });
    this.add(label);
  }

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
    // Called before anything updates in the scene
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
