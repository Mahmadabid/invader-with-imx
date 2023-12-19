import React, { useEffect, useRef, useState } from 'react';
import { useInterval } from './useInterval';
import {
  START_POSITION,
  GAME_SPEED,
  START_ENEMIES_POSITION,
} from './constants';

export interface ElementPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const SpaceInvader: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [playerPostion, setPlayerPosition] = useState<ElementPosition>({
    x: START_POSITION.x,
    y: START_POSITION.y,
    width: 50,
    height: 50,
  });
  const [bulletsPosition, setBulletPosition] = useState<ElementPosition[]>([]);
  const [enemies, setEnemies] = useState<ElementPosition[]>(START_ENEMIES_POSITION);

  const BULLET_WIDTH = 20;
  const BULLET_HEIGHT = 20;

  const [canFire, setCanFire] = useState(true);
  const [pressedKeys, setPressedKeys] = useState<Record<string, boolean>>({});

  const movePlayer = () => {
    setPlayerPosition((prevPosition) => {
      let newY = prevPosition.y;

      if (pressedKeys['ArrowRight']) {
        newY = Math.min(prevPosition.y + 5, 680 - prevPosition.width);
      }

      if (pressedKeys['ArrowLeft']) {
        newY = Math.max(prevPosition.y - 5, 0);
      }

      return { ...prevPosition, y: newY };
    });
  };

  const pressed = ({ code }: React.KeyboardEvent) => {
    if (code === 'Space' && canFire) {
      setBulletPosition((bullets) => [
        ...bullets,
        { ...playerPostion, width: BULLET_WIDTH, height: BULLET_HEIGHT },
      ]);
      setCanFire(false);

      setTimeout(() => {
        setCanFire(true);
      }, 400);
    }
  };

  const moveEnemies = () => {
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
                (enemy) =>
                  !collide(bullet, enemy)
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
    moveEnemies();
    moveBullets();
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
        <img
          className="absolute"
          src="/player.png"
          style={{ top: playerPostion.x, left: playerPostion.y, width: 50 }}
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
      </div>
    </div>
  );
};
