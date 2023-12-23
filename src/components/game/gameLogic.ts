import { useState } from 'react';
import { GameConstantsProps, useGameConstants } from './gameConstants';

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
    IPXUnclaimed: 0,
    Health: gameConst.Health,
    timer: gameConst.Level === 1? gameConst.timer + 8: gameConst.timer,
    win: false,
    interval: 0,
  };

  const [gameLogic, setGameLogic] = useState<GAMELOGIC>(GameLogic);

  return { gameLogic, setGameLogic };
};