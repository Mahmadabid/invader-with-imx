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
    IPXUnclaimed: gameConst.Level === 1? 3: gameConst.Level === 2? 4: 5,
    Health: gameConst.Health,
    timer: gameConst.Level === 1? gameConst.timer + 8: gameConst.Level === 2? gameConst.timer + 3: gameConst.timer,
    win: false,
    interval: 0,
  };

  const [gameLogic, setGameLogic] = useState<GAMELOGIC>(GameLogic);

  return { gameLogic, setGameLogic };
};