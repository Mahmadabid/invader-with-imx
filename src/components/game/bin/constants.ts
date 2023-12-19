import { ElementPosition } from "./space-invader";

export const START_POSITION = { x: 550, y: 310 };

export const START_ENEMIES_POSITION: ElementPosition[] = [
    { x: 100, y: 100, width: 50, height: 50 },
    { x: 150, y: 100, width: 50, height: 50 },
    { x: 200, y: 100, width: 50, height: 50 },
    { x: 100, y: 150, width: 50, height: 50 },
    { x: 150, y: 150, width: 50, height: 50 },
    { x: 200, y: 150, width: 50, height: 50 },
    { x: 100, y: 200, width: 50, height: 50 },
    { x: 150, y: 200, width: 50, height: 50 },
    { x: 200, y: 200, width: 50, height: 50 },
];

export const GAME_SPEED = 18;
