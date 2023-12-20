import React, { useEffect, useRef, useState } from 'react';
import { useInterval } from './useInterval';
import {
  GAME_SPEED,
  START_ENEMIES_POSITION,
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
  const [bulletsPosition, setBulletPosition] = useState<ElementPosition[]>([]);
  const [enemies, setEnemies] = useState<ElementPosition[]>(START_ENEMIES_POSITION);
  const [enemyBullets, setEnemyBullets] = useState<{ x: number; y: number; width: number; height: number; isFired: boolean, initialX: number }[]>([]);
  const [enemyCanFire, setEnemyCanFire] = useState(true);
  const { gameLogic, setGameLogic } = useGameLogic()

  const BULLET_WIDTH = 20;
  const BULLET_HEIGHT = 20;
  const ENEMY_BULLET_WIDTH = 10;
  const ENEMY_BULLET_HEIGHT = 10;
  const ENEMY_FIRE_INTERVAL = 2000;

  const [canFire, setCanFire] = useState(true);
  const [pressedKeys, setPressedKeys] = useState<Record<string, boolean>>({});

  const { playerPosition, movePlayer } = useMovePlayer(pressedKeys);

  const pressed = ({ code }: React.KeyboardEvent) => {
    if (code === 'Space' && canFire) {
      setBulletPosition((bullets) => [
        ...bullets,
        { ...playerPosition, width: BULLET_WIDTH, height: BULLET_HEIGHT },
      ]);
      setCanFire(false);

      setTimeout(() => {
        setCanFire(true);
      }, 400);
    }
  };

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

          }
          return bullet.x >= 0 && bullet.x + bullet.height < 600 && !bullet.collided;
        })
    );
  };
  
  const moveEnemiesAndFireBullets = () => {
    setEnemies((currentEnemies) =>
      currentEnemies.map((enemy) => {
        let updatedEnemy: ElementPosition;
        if (enemy.y < 60) {
          updatedEnemy = { x: enemy.x + 60, y: 580, width: 50, height: 50 };
        } else {
          updatedEnemy = { x: enemy.x, y: enemy.y - 5, width: 50, height: 50 };
        }
  
        if (updatedEnemy.x < 0) {
          updatedEnemy.x = 0;
        } else if (updatedEnemy.x + updatedEnemy.width > 800) {
          updatedEnemy.x = 800 - updatedEnemy.width;
        }
  
        if (Math.random() < 0.01 && enemyCanFire) {
          setEnemyCanFire(false);
  
          setTimeout(() => {
            setEnemyCanFire(true);
          }, ENEMY_FIRE_INTERVAL);
  
          setEnemyBullets((enemyBullets) => [
            ...enemyBullets,
            { x: enemy.x, y: enemy.y, width: ENEMY_BULLET_WIDTH, height: ENEMY_BULLET_HEIGHT, isFired: false, initialX: enemy.x },
            { x: enemy.x, y: enemy.y + 25, width: ENEMY_BULLET_WIDTH, height: ENEMY_BULLET_HEIGHT, isFired: false, initialX: enemy.x },
          ]);
        }
  
        return updatedEnemy;
      })
    );
  };

  const moveBullets = () => {
    setBulletPosition((bullets) =>
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
                      TotalPoints: prevGameLogic.TotalPoints + .5,
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
    movePlayer();
    moveEnemiesAndFireBullets();
    moveBullets();
    moveEnemyBullets();
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

  return (
    <div>
      <div
        className="w-[680px] h-[560px] bg-game"
        onKeyDown={(e) => pressed(e)}
        role="button"
        tabIndex={0}
        ref={ref}
        autoFocus
      >
        <div className="relative top-0 left-0 text-white font-bold p-4">
          Score: {gameLogic.TotalPoints}
        </div>
        <img
          className="absolute"
          src="/player.png"
          style={{ top: playerPosition.x, left: playerPosition.y, width: 50 }}
          alt="Player"
        />
        {enemies.map((enemy, index) => (
          <img
            key={'enemy' + index}
            className="absolute"
            src="/enemy.png"
            style={{ top: enemy.x, left: enemy.y, width: 50 }}
            alt={`Enemy ${index}`}
          />
        ))}
        {bulletsPosition.map((bullet, index) => (
          <img
            key={'bullet' + index}
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
      </div>
    </div>
  );
};