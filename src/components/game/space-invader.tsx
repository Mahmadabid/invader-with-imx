import React, { useEffect, useRef, useState } from 'react';
import { useInterval } from './useInterval';
import {
  GAME_SPEED,
  START_ENEMIES_POSITION,
  START_ENEMIES_POSITION_2,
  START_ENEMIES_POSITION_3,
  START_POSITION,
} from './constants';
import { handlePlayerCollision, movePlayerBullets, respawnPlayer, useMovePlayer } from './Player';
import { useGameLogic } from './gameLogic';
import { GameConstantsProps } from './gameConstants';
import { useJWT } from '../key';
import { UserProps, UserProvider } from '@/utils/immutable';
import { moveEnemiesAndFireBullets, moveEnemyBullets } from './Enemy';

export interface ElementPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Debris {
  x: number;
  y: number;
  width: number;
  height: number;
  active: boolean;
}

interface SpaceInvadersProps {
  gameConst: GameConstantsProps;
  setGameConst: React.Dispatch<React.SetStateAction<GameConstantsProps>>;
  levels: string;
  User: UserProps;
}

export const SpaceInvader: React.FC<SpaceInvadersProps> = ({ gameConst, setGameConst, levels, User }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { gameLogic, setGameLogic } = useGameLogic(gameConst);

  const userProvider = UserProvider();

  const jwt = useJWT(userProvider);

  const [playerBulletsPosition, setPlayerBulletPosition] = useState<ElementPosition[]>([]);
  const [enemies, setEnemies] = useState<ElementPosition[]>(gameConst.Level === 1 ? START_ENEMIES_POSITION : gameConst.Level === 2 ? START_ENEMIES_POSITION_2 : START_ENEMIES_POSITION_3);
  const [enemyBullets, setEnemyBullets] = useState<{ x: number; y: number; width: number; height: number; isFired: boolean, initialX: number }[]>([]);
  const [enemyCanFire, setEnemyCanFire] = useState(true);
  const [debris, setDebris] = useState<Debris[]>([]);
  const [background, setBackground] = useState('bg-game');
  const [keyView, setKeyView] = useState(false);
  const [playerPosition, setPlayerPosition] = useState<ElementPosition>({
    x: START_POSITION.x,
    y: START_POSITION.y,
    width: 36,
    height: 36,
  });

  const generateRandomDebris = () => {
    const debrisWidth = 30;
    const debrisHeight = 30;

    const randomX = 600;
    const randomY = Math.floor(Math.random() * (500 * 0.75 - debrisHeight) + 500 * 0.25);

    return { x: randomY, y: randomX, width: debrisWidth, height: debrisHeight, active: true };
  };

  useEffect(() => {
    if (gameConst.start && !gameLogic.gameover) {
      setDebris([generateRandomDebris()]);

      const debrisInterval = setInterval(() => {
        setDebris((prevDebris) => [...prevDebris, generateRandomDebris()]);
      }, gameConst.Level === 3 ? 1200 : 800);

      return () => clearInterval(debrisInterval);
    }
  }, [gameConst.start, gameLogic.gameover]);


  const timerInterval = 1000;

  useEffect(() => {
    if (gameConst.start && !gameLogic.gameover) {
      const timerId = setInterval(() => {
        if (!gameLogic.gameover) {
          setGameLogic((prevLogic) => ({
            ...prevLogic,
            timer: (prevLogic.timer > 0 ? prevLogic.timer - 1 : 0),
          }))
        }
      }, timerInterval);

      return () => clearInterval(timerId);
    }
  }, [gameLogic.interval, gameConst.start, gameLogic.gameover]);

  useEffect(() => {
    if (gameConst.start && !gameLogic.gameover) {
      if (gameLogic.timer <= 0) {
        setGameLogic((prevGameLogic) => ({
          ...prevGameLogic,
          gameover: true,
        }));
      }
    }
  }, [gameLogic.timer]);

  const dataToSend = {
    userId: gameConst.userId,
    data: {
      IPX: gameLogic.win ? gameLogic.IPXUnclaimed : 0,
      TotalPoints: gameLogic.TotalPoints,
      Address: gameConst.Address,
    },
    userProvider: User,
  }

  const sendData = async () => {

    try {
      const response = await fetch('/api/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwt.accessToken}`
        },
        body: JSON.stringify(dataToSend)
      });
      if (!response.ok) throw new Error('Failed to save data');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    if (gameConst.start && gameLogic.gameover) {
      sendData();
    }
  }, [gameConst.start, gameLogic.gameover])

  const BULLET_WIDTH = 13;
  const BULLET_HEIGHT = 13;
  const ENEMY_BULLET_WIDTH = gameConst.Level === 1 ? 16 : gameConst.Level === 2 ? 19 : 19;
  const ENEMY_BULLET_HEIGHT = gameConst.Level === 1 ? 16 : gameConst.Level === 2 ? 19 : 19;
  const ENEMY_FIRE_INTERVAL = gameConst.Level === 1 ? 950 : gameConst.Level === 2 ? 850 : 700;

  const [canFire, setCanFire] = useState(true);
  const [pressedKeys, setPressedKeys] = useState<Record<string, boolean>>({});

  const { movePlayer } = useMovePlayer(pressedKeys, setPlayerPosition, gameConst);

  const pressed = ({ code }: React.KeyboardEvent) => {

    if (code === 'KeyM' && gameConst.respawn) {
      respawnPlayer(setPlayerPosition, gameConst)
    }

    if (code === 'Space' && canFire) {
      const bulletsToFire = gameConst.Level < 4 ? gameConst.Level : 3;
      const newBullets = Array.from({ length: bulletsToFire }, (_, index) => ({
        ...playerPosition,
        y: gameConst.Level === 1 ? playerPosition.y + 25 * (index + 1.15) : gameConst.Level === 2 ? playerPosition.y + 25 * (index + 0.38) : gameConst.Level === 3 ? playerPosition.y + 25 * (index - 0.1) : playerPosition.y + 25 * (index - 0.23),
        width: BULLET_WIDTH,
        height: BULLET_HEIGHT,
      }));

      setPlayerBulletPosition((bullets) => [
        ...bullets,
        ...newBullets,
      ]);

      setCanFire(false);

      setTimeout(() => {
        setCanFire(true);
      }, (gameConst.Level === 4 ? (800 - gameConst.fireSpeed) : (1000 - gameConst.fireSpeed)));
    }
  };

  useEffect(() => {
    if (gameLogic.Health <= 0 && gameConst.start && !gameLogic.gameover) {
      setGameLogic((prevGameLogic) => ({
        ...prevGameLogic,
        gameover: true,
      }));
    }
  }, [gameLogic.Health])

  useEffect(() => {
    if (enemies.length === 0 && !gameLogic.gameover && gameConst.start) {
      setGameLogic((prevGameLogic) => ({
        ...prevGameLogic,
        win: true,
        gameover: true,
      }));
    }
  }, [enemies])

  const collide = (element1: ElementPosition, element2: ElementPosition) => {
    return (
      element1.x < element2.x + element2.width &&
      element1.x + element1.width > element2.x &&
      element1.y < element2.y + element2.height &&
      element1.y + element1.height > element2.y
    );
  };

  const moveDebris = (debrisArray: Debris[]): Debris[] => {
    return debrisArray.map((debris) => {
      const updatedDebris = {
        ...debris,
        y: debris.y !== 0 ? debris.y - 7 : debris.y,
        active: debris.y > 0,
      };

      if (collide(playerPosition, updatedDebris)) {
        handlePlayerCollision(setPlayerPosition, gameConst, gameLogic, setGameLogic);
        return null;
      }

      return updatedDebris;
    }).filter((debris): debris is Debris => debris !== null && debris.active);
  };

  const gameLoop = () => {
    if (gameConst.start && !gameLogic.gameover) {
      movePlayer();
      moveEnemiesAndFireBullets(ENEMY_BULLET_HEIGHT, ENEMY_BULLET_WIDTH, ENEMY_FIRE_INTERVAL, enemyCanFire, setEnemyCanFire, setPlayerBulletPosition, playerBulletsPosition, setPlayerPosition, setEnemies, playerPosition, setEnemyBullets, gameConst, gameLogic, setGameLogic, collide);
      movePlayerBullets(setPlayerBulletPosition, enemies, collide);
      moveEnemyBullets(setPlayerPosition, playerPosition, setEnemyBullets, gameConst, gameLogic, setGameLogic, collide);

      if (gameConst.Level > 2) {
        if (Math.random() < 1) {
          setDebris((currentDebris) => moveDebris(currentDebris));
        }
      }
    }
  };

  useInterval(() => gameLoop(), GAME_SPEED);

  const handleKeyDown = (e: KeyboardEvent) => {
    setPressedKeys((prevKeys) => ({ ...prevKeys, [e.code]: true }));
  };

  const handleKeyUp = (e: KeyboardEvent) => {
    setPressedKeys((prevKeys) => ({ ...prevKeys, [e.code]: false }));
  };

  useEffect(() => {
    ref.current?.focus();
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameConst.start, gameLogic.gameover]);

  const handleFirstStart = () => {
    setGameLogic((prevGameLogic) => ({
      ...prevGameLogic,
      gameover: false,
      TotalPoints: 0,
      Health: gameConst.Health,
      timer: gameConst.Level === 1 ? gameConst.timer + 4 : gameConst.Level === 2 ? gameConst.timer - 6 : gameConst.timer - 10,
      win: false,
      interval: (prevGameLogic.interval + 1)
    }));

    setEnemies(gameConst.Level === 1 ? START_ENEMIES_POSITION : gameConst.Level === 2 ? START_ENEMIES_POSITION_2 : START_ENEMIES_POSITION_3);
    setEnemyBullets([]);
    setEnemyCanFire(true);
    setCanFire(true);
    setPlayerBulletPosition([]);
    setDebris([]);

    respawnPlayer(setPlayerPosition, gameConst);
    setGameConst((prevGameConst) => ({
      ...prevGameConst,
      start: true
    }));
  }

  const handleStart = () => {
    setGameLogic((prevGameLogic) => ({
      ...prevGameLogic,
      gameover: false,
      TotalPoints: 0,
      Health: gameConst.Health,
      timer: gameConst.Level === 1 ? gameConst.timer + 4 : gameConst.Level === 2 ? gameConst.timer - 6 : gameConst.timer - 10,
      win: false,
      interval: (prevGameLogic.interval + 1)
    }));

    setEnemies(gameConst.Level === 1 ? START_ENEMIES_POSITION : gameConst.Level === 2 ? START_ENEMIES_POSITION_2 : START_ENEMIES_POSITION_3);
    setEnemyBullets([]);
    setEnemyCanFire(true);
    setCanFire(true);
    setDebris([]);
    setPlayerBulletPosition([]);

    respawnPlayer(setPlayerPosition, gameConst);
  }

  return (
    <div className='flex justify-center rounded'>
      <div>
        <h1 className="z-0 text-center absolute top-60 left-52 right-52 font-bold text-xl text-white">
          In case of any error. Please reload
        </h1>
      </div>
      {keyView ?
        <div className="w-[612px] h-[504px] mt-2 z-30 text-white text-center bg-black rounded">
          <h1 className='text-2xl font-bold my-4'>Keys</h1>
          <p className='font-medium mt-2 mb-2'>Move Left: <span className='font-normal text-[#30e9eb]'>Arrow Left</span></p>
          <p className='font-medium mt-2 mb-2'>Move Right: <span className='font-normal text-[#30e9eb]'>Arrow Right</span></p>
          <p className='font-medium mt-4 mb-2 text-slate-500'>These key unlock at level 2</p>
          <p className='font-medium mt-2 mb-2'>Move Left: <span className='font-normal text-[#30e9eb]'>Arrow Left</span></p>
          <p className='font-medium mt-2 mb-2'>Move Right: <span className='font-normal text-[#30e9eb]'>Arrow Right</span></p>
          <p className='font-medium mt-4 mb-2 text-slate-500'>This key will unlock with Teleport NFT</p>
          <p className='font-medium mt-2 mb-2'>Teleport: <span className='font-normal text-[#30e9eb]'>M</span></p>
          <button onClick={() => setKeyView(false)} className="font-bold my-4 text-xl bg-blue-500 text-white px-4 py-1 rounded-full hover:bg-blue-600 transition duration-300">Menu</button>
        </div>
        :
        gameLogic.gameover && gameConst.start ?
          <div className="w-[612px] h-[504px] mt-2 z-30 text-white text-center bg-black rounded">
            <h1 className='text-2xl font-bold my-4'>{gameLogic.win ? 'You Won!' : 'Game Over!'}</h1>
            <p className='font-medium mt-2 mb-4'>Your Level: {levels}</p>
            <p className='font-medium mt-2 mb-4'>Your score: {gameLogic.TotalPoints}</p>
            {gameLogic.win ? <p className='font-medium mt-2 mb-4'>IPX won: <span className='text-lime-500'>{gameLogic.IPXUnclaimed}</span></p> : <p className='font-medium mt-2 mb-4'>IPX won: <span className='text-lime-500'>You need to win first!</span></p>}
            <div className='text-xl font-medium text-white my-2 flex items-center justify-center'>
              <p className='mr-1'>You have:</p>
              <div className='flex flex-row items-center justify-center'>
                {gameConst.Health === 4 ? <img src='/health.png' alt='Bullets' width={30} height={30} className='mx-1' /> : null}
                {gameConst.fireSpeed === 100 ? <img src='/Bullets.png' alt='Health' width={30} height={30} className='mx-1' /> : null}
                {gameConst.timer === 35 ? <img src='/time.png' alt='Time' width={30} height={30} className='mx-1' /> : null}
                {gameConst.enemyFire === 0.005 ? <img src='/EnemiesBullets.png' alt='Enemy Fire' width={30} height={30} className='mx-1' /> : null}
                {gameConst.respawn === true ? <img src='/Teleport.png' alt='Teleport' width={30} height={30} className='mx-1' /> : null}
                {gameConst.Health === 4 || gameConst.fireSpeed === 100 || gameConst.timer === 35 || gameConst.enemyFire === 0.005 || gameConst.respawn === true ? null : <p className='text-slate-400 font-medium ml-2'>Buy some Powerups in Market</p>}
              </div>
            </div>
            <div className='text-xl font-medium text-white my-4 flex items-center justify-center'>
              <p className='mr-1'>Select Background:</p>
              <div className='flex flex-row items-center justify-center'>
                <img src='/background.png' onClick={() => setBackground('bg-game')} alt='background' width={60} height={60} className={`mx-1 ${background === 'bg-game' ? 'border-4 border-white' : ''}`} />
                <img src='/background1.png' onClick={() => setBackground('bg-game1')} alt='background1' width={60} height={60} className={`mx-1 ${background === 'bg-game1' ? 'border-4 border-white' : ''}`} />
                <img src='/background2.png' onClick={() => setBackground('bg-game2')} alt='background2' width={60} height={60} className={`mx-1 ${background === 'bg-game2' ? 'border-4 border-white' : ''}`} />
              </div>
            </div>
            <button onClick={() => setKeyView(true)} className="font-bold my-2 text-xl bg-[#008b8b] text-white px-4 pb-2 pt-1 rounded-full hover:bg-[#008b8b] transition duration-300">Keys</button>
            <br/>
            <button onClick={handleStart} className="font-bold mt-3 text-2xl bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600 transition duration-300">Start Again</button>
          </div> : !gameLogic.gameover && !gameConst.start ?
            <div className="w-[612px] h-[504px] mt-2 z-30 text-white text-center bg-black rounded">
              <h1 className='text-2xl font-bold my-4'>Ready!</h1>
              <p className='font-medium mt-2 mb-4'>Your Level: {levels}</p>
              <div className='text-xl font-medium text-white my-2 flex items-center justify-center'>
                <p className='mr-1'>You have:</p>
                <div className='flex flex-row items-center justify-center'>
                  {gameConst.Health === 4 ? <img src='/health.png' alt='Bullets' width={30} height={30} className='mx-1' /> : null}
                  {gameConst.fireSpeed === 100 ? <img src='/Bullets.png' alt='Health' width={30} height={30} className='mx-1' /> : null}
                  {gameConst.timer === 35 ? <img src='/time.png' alt='Time' width={30} height={30} className='mx-1' /> : null}
                  {gameConst.enemyFire === 0.005 ? <img src='/EnemiesBullets.png' alt='Enemy Fire' width={30} height={30} className='mx-1' /> : null}
                {gameConst.respawn === true ? <img src='/Teleport.png' alt='Teleport' width={30} height={30} className='mx-1' /> : null}
                {gameConst.Health === 4 || gameConst.fireSpeed === 100 || gameConst.timer === 35 || gameConst.enemyFire === 0.005 || gameConst.respawn === true ? null : <p className='text-slate-400 font-medium ml-2'>Buy some Powerups in Market</p>}
              </div>
              </div>
              <div className='text-xl font-medium text-white my-4 flex items-center justify-center'>
                <p className='mr-1'>Select Background:</p>
                <div className='flex flex-row items-center justify-center'>
                  <img src='/background.png' onClick={() => setBackground('bg-game')} alt='background' width={60} height={60} className={`mx-1 ${background === 'bg-game' ? 'border-4 border-white' : ''}`} />
                  <img src='/background1.png' onClick={() => setBackground('bg-game1')} alt='background1' width={60} height={60} className={`mx-1 ${background === 'bg-game1' ? 'border-4 border-white' : ''}`} />
                  <img src='/background2.png' onClick={() => setBackground('bg-game2')} alt='background2' width={60} height={60} className={`mx-1 ${background === 'bg-game2' ? 'border-4 border-white' : ''}`} />
                </div>
              </div>
              <p className='font-medium mt-2 mb-4'></p>
              <button onClick={() => setKeyView(true)} className="font-bold my-2 text-xl bg-[#008b8b] text-white px-4 pb-2 pt-1 rounded-full hover:bg-[#008b8b] transition duration-300">Keys</button>
              <br />
              <button onClick={handleFirstStart} className="font-bold mt-3 text-2xl bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600 transition duration-300">Start</button>
            </div> :
            <div
              className={`w-[612px] h-[504px] mt-2 z-30 relative ${background} border-none rounded`}
              onKeyDown={(e) => pressed(e)}
              role="button"
              tabIndex={0}
              ref={ref}
              autoFocus
            >
              <div className="absolute top-0 left-0 text-white font-bold p-4">
                Score: {gameLogic.TotalPoints}
              </div>
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 text-white font-bold mt-4">
                Time Left: {gameLogic.timer}s
              </div>
              <div className="absolute top-0 right-0 mt-4">
                {gameLogic.Health > 0 && [...Array(gameLogic.Health)].map((_, index) =>
                  <svg
                    key={index}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="red"
                    className="w-6 h-6 inline-block z-40"
                  >
                    <path fillRule="evenodd" d="M9.315 7.584C12.195 3.883 16.695 1.5 21.75 1.5a.75.75 0 0 1 .75.75c0 5.056-2.383 9.555-6.084 12.436A6.75 6.75 0 0 1 9.75 22.5a.75.75 0 0 1-.75-.75v-4.131A15.838 15.838 0 0 1 6.382 15H2.25a.75.75 0 0 1-.75-.75 6.75 6.75 0 0 1 7.815-6.666ZM15 6.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z" clipRule="evenodd" />
                    <path d="M5.26 17.242a.75.75 0 1 0-.897-1.203 5.243 5.243 0 0 0-2.05 5.022.75.75 0 0 0 .625.627 5.243 5.243 0 0 0 5.022-2.051.75.75 0 1 0-1.202-.897 3.744 3.744 0 0 1-3.008 1.51c0-1.23.592-2.323 1.51-3.008Z" />
                  </svg>
                )}
              </div>
              <img
                className="absolute z-50"
                src={gameConst.Level === 1 ? '/player.png' : gameConst.Level === 2 ? '/playerv2.png' : gameConst.Level === 3 ? '/playerv3.png' : '/playerv4.png'}
                style={{ top: playerPosition.x, left: playerPosition.y, width: gameConst.Level === 4 ? 50 : gameConst.Level === 1 ? 70 : 56, height: gameConst.Level === 4 ? 50 : gameConst.Level === 1 ? 70 : 56 }}
                alt="Player"
              />
              {enemies.map((enemy, index) => (
                <img
                  key={'enemy' + index}
                  className="absolute"
                  src="/enemy.png"
                  style={{ top: enemy.x, left: enemy.y, width: 27, height: 27 }}
                  alt={`Enemy ${index}`}
                />
              ))}
              {playerBulletsPosition.map((bullet, index) => (
                <img
                  key={`bullet${index}`}
                  className="absolute"
                  src="/bullet.png"
                  style={{ top: bullet.x, left: bullet.y, width: bullet.width, height: bullet.height }}
                  alt={`Bullet ${index}`}
                />
              ))}
              {enemyBullets.map((bullet, index) => (
                <img
                  key={'enemyBullet' + index}
                  className="absolute"
                  src="/EnemyBullet.png"
                  style={{
                    top: bullet.x,
                    left: bullet.y,
                    width: bullet.width,
                    height: bullet.height,
                    transform: 'scaleY(-1)',
                  }}
                  alt={`Enemy Bullet ${index}`}
                />
              ))}
              {!gameLogic.gameover && gameConst.Level > 2 ? debris.map((debris, index) => (
                <img
                  key={`debris${index}`}
                  className="absolute"
                  src="/debris.png"
                  style={{ top: debris.x, left: debris.y, width: debris.width, height: debris.height }}
                  alt={`Debris ${index}`}
                />
              )) : null}
            </div>}
    </div>
  );
};