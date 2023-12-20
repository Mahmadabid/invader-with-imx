import { useState } from 'react';

export interface GAMELOGIC {
  gameover: boolean;
  TotalPoints: number;
  IPXUnclaimed: number;
  Level: number;
  Health: number;
}

export const useGameLogic = () => {
  const GameLogic: GAMELOGIC = {
    gameover: false,
    TotalPoints: 0,
    IPXUnclaimed: 0,
    Level: 2,
    Health: 3
  };

  const [gameLogic, setGameLogic] = useState<GAMELOGIC>(GameLogic);

  return { gameLogic, setGameLogic };
};