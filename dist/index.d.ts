declare type Config = {
    aspectRatio: number;
    fov: number;
    cameraHeight: number;
    edgeColor: string;
    faceColor: string;
    birdColor: string;
    shadowColor: string;
};

export declare function renderVisuals(window: Window, canvas: HTMLCanvasElement, config: Omit<Config, 'aspectRatio'>, showStats?: boolean): void;

export { }
