import React, { useEffect, useRef, useState } from 'react';
import { useInterval } from './useInterval';
import {
  GAME_SPEED,
  START_ENEMIES_POSITION,
  START_ENEMIES_POSITION_2,
  START_ENEMIES_POSITION_3,
  START_POSITION,
} from './constants';
import { useMovePlayer } from './movePlayer';
import { useGameLogic } from './gameLogic';
import { GameConstantsProps } from './gameConstants';
import { useJWT } from '../key';
import { UserProps, UserProvider } from '@/utils/immutable';

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
      }, 1200);

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
      IPX: gameLogic.win ? gameConst.Level === 1 ? 1 : gameConst.Level === 2 ? 2 : 3 : 0,
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
  const ENEMY_BULLET_WIDTH = gameConst.Level === 1 ? 10 : gameConst.Level === 2 ? 12 : 12;
  const ENEMY_BULLET_HEIGHT = gameConst.Level === 1 ? 10 : gameConst.Level === 2 ? 12 : 12;
  const ENEMY_FIRE_INTERVAL = gameConst.Level === 1 ? 950 : gameConst.Level === 2 ? 850 : 700;

  const [canFire, setCanFire] = useState(true);
  const [pressedKeys, setPressedKeys] = useState<Record<string, boolean>>({});

  const { movePlayer } = useMovePlayer(pressedKeys, setPlayerPosition, gameConst);

  const pressed = ({ code }: React.KeyboardEvent) => {

    if (code === 'Space' && canFire) {
      const bulletsToFire = gameConst.Level;
      const newBullets = Array.from({ length: bulletsToFire }, (_, index) => ({
        ...playerPosition,
        y: gameConst.Level === 1 ? playerPosition.y + 25 * (index + 0.85) : gameConst.Level === 2 ? playerPosition.y + 25 * (index + 0.35) : playerPosition.y + 25 * (index - 0.2),
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
      }, (1000 - gameConst.fireSpeed));
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

  const moveEnemyBullets = () => {
    if (gameConst.start && !gameLogic.gameover) {
      setEnemyBullets((enemyBullets) =>
        enemyBullets
          .map((bullet) => ({
            x: bullet.x + 5,
            y: bullet.y,
            width: bullet.width,
            height: bullet.height,
            collided: collide(bullet, playerPosition),
            isFired: bullet.isFired || bullet.x >= bullet.initialX,
            initialX: bullet.initialX || bullet.x,
          }))
          .filter((bullet) => {
            if (bullet.collided) {
              handlePlayerCollision();
            }
            return bullet.x >= 0 && bullet.x + bullet.height < 504 && !bullet.collided;
          })
      );
    }
  };

  const respawnPlayer = () => {
    setPlayerPosition({
      x: START_POSITION.x,
      y: START_POSITION.y,
      width: 36,
      height: 36,
    });
  };

  const moveEnemiesAndFireBullets = () => {
    if (gameConst.start && !gameLogic.gameover) {
      setEnemies((currentEnemies: ElementPosition[]) => {

        const updatedEnemies = currentEnemies.map((enemy) => {
          let updatedEnemy: ElementPosition;
          if (enemy.y < 10) {
            updatedEnemy = { x: enemy.x + 35, y: 600, width: 27, height: 27 };
          } else {
            updatedEnemy = { x: enemy.x, y: enemy.y - (gameConst.Level === 1 ? 7 : gameConst.Level === 2 ? 9 : 11), width: 27, height: 27 };
          }

          updatedEnemy.x = Math.max(0, Math.min(504 - updatedEnemy.height, updatedEnemy.x));
          updatedEnemy.y = Math.max(0, Math.min(613 - updatedEnemy.width, updatedEnemy.y));

          if (collide(playerPosition, updatedEnemy)) {
            handlePlayerCollision();
            return null;
          }

          if (Math.random() < (gameConst.Level === 1 ? (0.025 - gameConst.enemyFire) : gameConst.Level === 2 ? (0.03 - gameConst.enemyFire) : (0.0325 - gameConst.enemyFire)) && enemyCanFire) {
            setEnemyCanFire(false);

            setTimeout(() => {
              setEnemyCanFire(true);
            }, ENEMY_FIRE_INTERVAL);

            setEnemyBullets((enemyBullets) => [
              ...enemyBullets,
              { x: updatedEnemy.x, y: updatedEnemy.y, width: ENEMY_BULLET_WIDTH, height: ENEMY_BULLET_HEIGHT, isFired: false, initialX: updatedEnemy.x },
            ]);
          }

          if (!updatedEnemy) {
            setGameLogic((prevGameLogic) => ({
              ...prevGameLogic,
              gameover: true,
            }));
          }

          return updatedEnemy;

        });

        const filteredEnemies = updatedEnemies.filter((enemy) => enemy !== null) as ElementPosition[];

        const allEnemiesDead = filteredEnemies.every((enemy) => enemy.y >= 490);

        if (allEnemiesDead) {
          setGameLogic((prevGameLogic) => ({
            ...prevGameLogic,
            win: true,
            gameover: true,
            IPXUnclaimed: (gameConst.Level === 1 ? 1 : gameConst.Level === 2 ? 2 : 3)
          }));
        }

        return filteredEnemies;
      });
    }
  };

  const movePlayerBullets = () => {
    setPlayerBulletPosition((bullets) =>
      bullets
        .map((bullet) => ({
          x: bullet.x - 5,
          y: bullet.y,
          width: bullet.width,
          height: bullet.height,
          collided: enemies.some((enemy) => collide(enemy, bullet)),
        }))
        .filter((bullet) => {
          if (bullet.x === 0) {
            return false
          }
          if (bullet.collided) {
            setEnemies((enemies) => enemies.filter((enemy) => !collide(enemy, bullet)));
            setGameLogic((prevGameLogic) => ({
              ...prevGameLogic,
              TotalPoints: prevGameLogic.TotalPoints + 0.5,
            }));
            return false;
          }
          return true;
        })
    );
  };

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
        handlePlayerCollision();
        return null;
      }

      return updatedDebris;
    }).filter((debris): debris is Debris => debris !== null && debris.active);
  };

  const handlePlayerCollision = () => {
    if (gameConst.start && !gameLogic.gameover) {
      setGameLogic((prevGameLogic) => ({
        ...prevGameLogic,
        Health: prevGameLogic.Health - 1,
      }));

      respawnPlayer();
    };
  };

  const gameLoop = () => {
    if (gameConst.start && !gameLogic.gameover) {
      movePlayer();
      moveEnemiesAndFireBullets();
      movePlayerBullets();
      moveEnemyBullets();

      if (gameConst.Level === 3) {
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
      IPXUnclaimed: 0,
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

    respawnPlayer();
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
      IPXUnclaimed: 0,
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

    respawnPlayer();
  }

  const headerHeight = 4.65;

  return (
    <div className='flex justify-center bg-gray-950' style={{ minHeight: `calc(100vh - ${headerHeight}rem)` }}>
      <h1 className="flex items-center justify-center z-0 absolute top-0 bottom-0 left-0 right-0 font-bold text-xl text-white">
        In case of any error. Please reload
      </h1>
      {gameLogic.gameover && gameConst.start ?
        <div className="w-[612px] h-[504px] mt-2 z-50 text-white text-center bg-black">
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
              {gameConst.Health === 4 || gameConst.fireSpeed === 100 || gameConst.timer === 35 ? null : <p className='text-slate-400 font-medium ml-2'>Buy some Powerups in Market</p>}
            </div>
          </div>
          <button onClick={handleStart} className="font-bold mt-3 text-2xl bg-green-500 text-white px-6 py-3 rounded-full hover:bg-green-600 transition duration-300">Start Again</button>
        </div> : !gameLogic.gameover && !gameConst.start ?
          <div className="w-[612px] h-[504px] mt-2 z-50 text-white text-center bg-black">
            <h1 className='text-2xl font-bold my-4'>Ready!</h1>
            <p className='font-medium mt-2 mb-4'>Your Level: {levels}</p>
            <div className='text-xl font-medium text-white my-2 flex items-center justify-center'>
              <p className='mr-1'>You have:</p>
              <div className='flex flex-row items-center justify-center'>
                {gameConst.Health === 4 ? <img src='/health.png' alt='Bullets' width={30} height={30} className='mx-1' /> : null}
                {gameConst.fireSpeed === 100 ? <img src='/Bullets.png' alt='Health' width={30} height={30} className='mx-1' /> : null}
                {gameConst.timer === 35 ? <img src='/time.png' alt='Time' width={30} height={30} className='mx-1' /> : null}
                {gameConst.Health === 4 || gameConst.fireSpeed === 100 || gameConst.timer === 35 ? null : <p className='text-slate-400 font-medium ml-2'>Buy some Powerups in Market</p>}
              </div>
            </div>
            <p className='font-medium mt-2 mb-4'></p>
            <button onClick={handleFirstStart} className="font-bold mt-3 text-2xl bg-green-500 text-white px-6 py-3 rounded-full hover:bg-green-600 transition duration-300">Start</button>
          </div> :
          <div
            className="w-[612px] h-[504px] mt-2 z-50 relative bg-game border-none"
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
              {[...Array(gameLogic.Health)].map((_, index) =>
                <svg
                  key={index}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="red"
                  className="w-6 h-6 inline-block z-50"
                >
                  <path fillRule="evenodd" d="M9.315 7.584C12.195 3.883 16.695 1.5 21.75 1.5a.75.75 0 0 1 .75.75c0 5.056-2.383 9.555-6.084 12.436A6.75 6.75 0 0 1 9.75 22.5a.75.75 0 0 1-.75-.75v-4.131A15.838 15.838 0 0 1 6.382 15H2.25a.75.75 0 0 1-.75-.75 6.75 6.75 0 0 1 7.815-6.666ZM15 6.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z" clipRule="evenodd" />
                  <path d="M5.26 17.242a.75.75 0 1 0-.897-1.203 5.243 5.243 0 0 0-2.05 5.022.75.75 0 0 0 .625.627 5.243 5.243 0 0 0 5.022-2.051.75.75 0 1 0-1.202-.897 3.744 3.744 0 0 1-3.008 1.51c0-1.23.592-2.323 1.51-3.008Z" />
                </svg>
              )}
            </div>
            <img
              className="absolute"
              src={gameConst.Level === 1 ? '/player.png' : gameConst.Level === 2 ? '/playerv2.png' : '/playerv3.png'}
              style={{ top: playerPosition.x, left: playerPosition.y, width: gameConst.Level === 3 ? 50 : 56, height: gameConst.Level === 3 ? 50 : 56 }}
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
                src="/bullet.png"
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
            {!gameLogic.gameover && gameConst.Level === 3 ? debris.map((debris, index) => (
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