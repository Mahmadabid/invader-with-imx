import { useState } from 'react';
import { useGameConstants } from './gameConstants';

export interface GAMELOGIC {
  gameover: boolean;
  TotalPoints: number;
  IPXUnclaimed: number;
  Health: number;
  timer: number;
  win: boolean;
  interval: number;
}

export const useGameLogic = () => {

  const { gameConst } = useGameConstants();

  const GameLogic: GAMELOGIC = {
    gameover: false,
    TotalPoints: 0,
    IPXUnclaimed: 0,
    Health: gameConst.Health,
    timer: gameConst.timer,
    win: false,
    interval: 0,
  };

  const [gameLogic, setGameLogic] = useState<GAMELOGIC>(GameLogic);

  return { gameLogic, setGameLogic };
};