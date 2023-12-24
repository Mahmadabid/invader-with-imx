import { useState } from 'react';

export interface GameConstantsProps {
  Level: number;
  Health: number;
  fireSpeed: number;
  start: boolean;
  timer: number;
  enemyFire: number;
  Address: string;
  userId: string;
}

export const useGameConstants = () => {
  const GameConst: GameConstantsProps = {
    Level: 1,
    Health: 3,
    fireSpeed: 0,
    start: false,
    timer: 30,
    enemyFire: 0,
    Address: '',
    userId: '',
  };

  const [gameConst, setGameConst] = useState<GameConstantsProps>(GameConst);

  return { gameConst, setGameConst };
};