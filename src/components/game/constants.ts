import { ElementPosition } from "./space-invader";

export const START_POSITION = { x: 500, y: 310 };

export const START_ENEMIES_POSITION: ElementPosition[] = [
    { x: 20, y: 100, width: 30, height: 30 },
    { x: 100, y: 100, width: 30, height: 30 },
    { x: 150, y: 100, width: 30, height: 30 },
    { x: 30, y: 150, width: 30, height: 30 },
    { x: 150, y: 150, width: 30, height: 30 },
    { x: 100, y: 150, width: 30, height: 30 },
    { x: 30, y: 200, width: 30, height: 30 },
    { x: 150, y: 200, width: 30, height: 30 },
    { x: 100, y: 200, width: 30, height: 30 },
];

export const GAME_SPEED = 10;
