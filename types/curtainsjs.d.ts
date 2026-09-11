declare module "curtainsjs" {
  type Source = HTMLImageElement | HTMLCanvasElement | HTMLVideoElement;

  export class Texture {
    _samplerName?: string;
    setSource(source: Source): void;
  }

  export class Curtains {
    constructor(params: Record<string, unknown>);
    gl: WebGLRenderingContext | WebGL2RenderingContext | null;
    onError(callback: () => void): this;
    onContextLost(callback: () => void): this;
    enableDrawing(): void;
    disableDrawing(): void;
    needRender(): void;
    dispose(): void;
  }

  export class Plane {
    constructor(curtains: Curtains, element: HTMLElement, params: Record<string, unknown>);
    textures: Texture[];
    uniforms: Record<string, { value: number }>;
    onReady(callback: () => void): this;
  }
}
