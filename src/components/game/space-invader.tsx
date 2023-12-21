import React, { useEffect, useRef, useState } from 'react';
import { useInterval } from './useInterval';
import {
  GAME_SPEED,
  START_ENEMIES_POSITION,
  START_ENEMIES_POSITION_2,
  START_POSITION,
} from './constants';
import { useMovePlayer } from './movePlayer';
import { useGameLogic } from './gameLogic';

export interface ElementPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const SpaceInvader: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { gameLogic, setGameLogic } = useGameLogic();
  const [playerBulletsPosition, setPlayerBulletPosition] = useState<ElementPosition[]>([]);
  const [enemies, setEnemies] = useState<ElementPosition[]>(gameLogic.Level === 1 ? START_ENEMIES_POSITION : START_ENEMIES_POSITION_2);
  const [enemyBullets, setEnemyBullets] = useState<{ x: number; y: number; width: number; height: number; isFired: boolean, initialX: number }[]>([]);
  const [enemyCanFire, setEnemyCanFire] = useState(true);
  const [playerPosition, setPlayerPosition] = useState<ElementPosition>({
    x: START_POSITION.x,
    y: START_POSITION.y,
    width: 50,
    height: 50,
  });


  const [timer, setTimer] = useState(40);
  const timerInterval = 1000;

  useEffect(() => {
    const timerId = setInterval(() => {
      !gameLogic.gameover ?
        setTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : prevTimer)) : null
    }, timerInterval);

    return () => clearInterval(timerId);

  }, []);

  useEffect(() => {
    if (timer <= 0) {
      setGameLogic((prevGameLogic) => ({
        ...prevGameLogic,
        gameover: true,
      }));
    }
  }, [timer]);

  const BULLET_WIDTH = 13;
  const BULLET_HEIGHT = 13;
  const ENEMY_BULLET_WIDTH = gameLogic.Level === 1 ? 10 : 12;
  const ENEMY_BULLET_HEIGHT = gameLogic.Level === 1 ? 10 : 12;
  const ENEMY_FIRE_INTERVAL = gameLogic.Level === 1 ? 950 : 800;

  const [canFire, setCanFire] = useState(true);
  const [pressedKeys, setPressedKeys] = useState<Record<string, boolean>>({});

  const { movePlayer } = useMovePlayer(pressedKeys, setPlayerPosition);

  const pressed = ({ code }: React.KeyboardEvent) => {
    if (code === 'Space' && canFire) {
      const bulletsToFire = gameLogic.Level;
      const newBullets = Array.from({ length: bulletsToFire }, (_, index) => ({
        ...playerPosition,
        y: playerPosition.y + 25 * index,
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
      }, gameLogic.fireSpeed);
    }
  };


  useEffect(() => {
    if (gameLogic.Health <= 0) {
      setGameLogic((prevGameLogic) => ({
        ...prevGameLogic,
        gameover: true,
      }));
    }
  }, [gameLogic.Health])

  const moveEnemyBullets = () => {
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
          return bullet.x >= 0 && bullet.x + bullet.height < 560 && !bullet.collided;
        })
    );
  };

  const respawnPlayer = () => {
    setPlayerPosition({
      x: START_POSITION.x,
      y: START_POSITION.y,
      width: 50,
      height: 50,
    });
  };

  const handlePlayerCollision = () => {
    setGameLogic((prevGameLogic) => ({
      ...prevGameLogic,
      Health: prevGameLogic.Health - 1,
    }));

    respawnPlayer();
  };

  const moveEnemiesAndFireBullets = () => {
    setEnemies((currentEnemies: ElementPosition[]) => {

      const updatedEnemies = currentEnemies.map((enemy) => {
        let updatedEnemy: ElementPosition;
        if (enemy.y < 10) {
          updatedEnemy = { x: enemy.x + 40, y: 700, width: 50, height: 50 };
        } else {
          updatedEnemy = { x: enemy.x, y: enemy.y - (gameLogic.Level === 1 ? 7 : 10), width: 50, height: 50 };
        }

        updatedEnemy.x = Math.max(0, Math.min(570 - updatedEnemy.width, updatedEnemy.x));
        updatedEnemy.y = Math.max(0, Math.min(700 - updatedEnemy.height, updatedEnemy.y));

        if (collide(playerPosition, updatedEnemy)) {
          handlePlayerCollision();
          return null;
        }

        if (Math.random() < (gameLogic.Level === 1 ? 0.025 : 0.0325) && enemyCanFire) {
          setEnemyCanFire(false);

          setTimeout(() => {
            setEnemyCanFire(true);
          }, ENEMY_FIRE_INTERVAL);

          setEnemyBullets((enemyBullets) => [
            ...enemyBullets,
            { x: updatedEnemy.x, y: updatedEnemy.y, width: ENEMY_BULLET_WIDTH, height: ENEMY_BULLET_HEIGHT, isFired: false, initialX: updatedEnemy.x },
          ]);
        }

        if (updatedEnemy.x >= 520) {
          setGameLogic((prevGameLogic) => ({
            ...prevGameLogic,
            gameover: true,
          }));
        }

        return updatedEnemy;
      });

      const filteredEnemies = updatedEnemies.filter((enemy) => enemy !== null) as ElementPosition[];

      const allEnemiesDead = filteredEnemies.every((enemy) => enemy.y >= 700);

      if (allEnemiesDead) {
        setGameLogic((prevGameLogic) => ({
          ...prevGameLogic,
          gameover: true,
        }));
      }

      return filteredEnemies;
    });
  };


  const movePlayerBullets = () => {
    setPlayerBulletPosition((bullets) =>
      bullets
        .map((bullet) => ({
          x: bullet.x - 5,
          y: bullet.y,
          width: bullet.width,
          height: bullet.height,
          collided: enemies.some((enemy) =>
            collide(bullet, enemy)
          ),
        }))
        .filter((bullet) => {
          if (bullet.collided) {
            setEnemies((enemies) =>
              enemies.filter(
                (enemy) => {
                  if (collide(bullet, enemy)) {
                    setGameLogic((prevGameLogic) => ({
                      ...prevGameLogic,
                      TotalPoints: prevGameLogic.TotalPoints + 1,
                    }));
                  }
                  return !collide(bullet, enemy);
                }
              )
            );
          }
          return bullet.x > 0 && !bullet.collided;
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

  const gameLoop = () => {
    if (!gameLogic.gameover) {
      movePlayer();
      moveEnemiesAndFireBullets();
      movePlayerBullets();
      moveEnemyBullets();
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
  }, []);

  const handleStart = () => {
    setGameLogic((prevGameLogic) => ({
      ...prevGameLogic,
      gameover: false,
      start: true,
      TotalPoints: 0
    }));

    setPlayerBulletPosition([]);
    setEnemies(gameLogic.Level === 1 ? START_ENEMIES_POSITION : START_ENEMIES_POSITION_2);
    setEnemyBullets([]);
    setEnemyCanFire(true);

    setPlayerPosition({
      x: START_POSITION.x,
      y: START_POSITION.y,
      width: 50,
      height: 50,
    });
    
    setTimer(40);
    setPressedKeys({});
  }

  const headerHeight = 4.65;

  return (
    <div className='flex justify-center bg-gray-950' style={{ minHeight: `calc(100vh - ${headerHeight}rem)` }}>
      {gameLogic.gameover ? !gameLogic.start ?
        <div className="w-[680px] h-[560px] mt-2 text-white text-center bg-black">
          <h1 className='text-2xl font-bold my-4'>Ready!</h1>
          <p className='font-medium mt-2 mb-4'></p>
          <button onClick={handleStart} className="font-bold text-2xl bg-green-500 text-white px-6 py-3 rounded-full hover:bg-green-600 transition duration-300">Start</button>
        </div> :
        <div className="w-[680px] h-[560px] mt-2 text-white text-center bg-black">
          <h1 className='text-2xl font-bold my-4'>Game Over!</h1>
          <p className='font-medium mt-2 mb-4'>Your score: {gameLogic.TotalPoints}</p>
          <button onClick={handleStart} className="font-bold text-2xl bg-green-500 text-white px-6 py-3 rounded-full hover:bg-green-600 transition duration-300">Start Again</button>
        </div> :
        <div
          className="w-[680px] h-[560px] mt-2 relative bg-game border-none"
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
            Time Left: {timer}s
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
            src={gameLogic.Level === 1 ? '/player.png' : '/playerv2.png'}
            style={{ top: playerPosition.x, left: playerPosition.y, width: 40, height: 40 }}
            alt="Player"
          />
          {enemies.map((enemy, index) => (
            <img
              key={'enemy' + index}
              className="absolute"
              src="/enemy.png"
              style={{ top: enemy.x, left: enemy.y, width: 30, height: 30 }}
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
              src="/Bullet.png"
              style={{
                top: bullet.x,
                left: bullet.y,
                width: bullet.width,
                height: bullet.height,
              }}
              alt={`Enemy Bullet ${index}`}
            />
          ))}
        </div>}
    </div>
  );
};