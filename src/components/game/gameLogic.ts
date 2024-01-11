import { useState } from 'react';
import { GameConstantsProps } from './gameConstants';

export interface GAMELOGIC {
  gameover: boolean;
  TotalPoints: number;
  IPXUnclaimed: number;
  Health: number;
  timer: number;
  win: boolean;
  interval: number;
}

export const useGameLogic = (gameConst: GameConstantsProps) => {

  const GameLogic: GAMELOGIC = {
    gameover: false,
    TotalPoints: 0,
    IPXUnclaimed: gameConst.Level === 1? 1: gameConst.Level === 2? 2: 3,
    Health: gameConst.Health,
    timer: gameConst.Level === 1 ? gameConst.timer + 2 : gameConst.Level === 2 ? gameConst.timer - 6 : gameConst.timer - 10,
    win: false,
    interval: 0,
  };

  const [gameLogic, setGameLogic] = useState<GAMELOGIC>(GameLogic);

  return { gameLogic, setGameLogic };
};