import { START_POSITION } from "./constants";
import { GameConstantsProps } from "./gameConstants";
import { GAMELOGIC } from "./gameLogic";
import { ElementPosition } from "./space-invader";

export const useMovePlayer = (pressedKeys: Record<string, boolean>, setPlayerPosition: React.Dispatch<React.SetStateAction<ElementPosition>>, gameConst: GameConstantsProps) => {

    const movePlayer = () => {
        setPlayerPosition((prevPosition) => {
          let newX = prevPosition.x;
          let newY = prevPosition.y;
      
          if (pressedKeys['ArrowRight']) {
            newY = gameConst.Level === 2 ? Math.min(prevPosition.y + 5, 593 - prevPosition.height) : gameConst.Level === 4 ? Math.min(prevPosition.y + 6, 607 - prevPosition.height) : gameConst.Level === 1 ? Math.min(prevPosition.y + 5, 589 - prevPosition.height) : Math.min(prevPosition.y + 5, 600 - prevPosition.height);
      
            if (gameConst.Level === 4 && newY >= 607 - prevPosition.height) {
              newY = -7.9;
            }
          }
      
          if (pressedKeys['ArrowLeft']) {
            newY = gameConst.Level === 2 ? Math.max(prevPosition.y - 5, -1) : gameConst.Level === 4 ? Math.max(prevPosition.y - 6, -8) : gameConst.Level === 1 ? Math.max(prevPosition.y - 5, -11) : Math.max(prevPosition.y - 5, -7);
      
            if (gameConst.Level === 4 && newY < -7.9) {
              newY = 607 - prevPosition.height;
            }
          }
      
          if (gameConst.Level > 1) {
            if (pressedKeys['ArrowUp']) {
              newX = Math.max(prevPosition.x - 6, 10);
            }
      
            if (pressedKeys['ArrowDown']) {
              newX = Math.min(prevPosition.x + 6, 490 - prevPosition.width);
            }
          }
      
          return { ...prevPosition, x: newX, y: newY };
        });
      };
      
    return { movePlayer };
};

export const respawnPlayer = (setPlayerPosition: React.Dispatch<React.SetStateAction<ElementPosition>>, gameConst: GameConstantsProps) => {
    setPlayerPosition({
        x: gameConst.Level === 1 ? START_POSITION.x - 10 : gameConst.Level === 2 ? START_POSITION.x - 4 : gameConst.Level === 3 ? START_POSITION.x - 2 : START_POSITION.x - 2,
        y: gameConst.Level === 1 ? START_POSITION.y - 38 : gameConst.Level === 2 ? START_POSITION.y - 31 : gameConst.Level === 3 ? START_POSITION.y - 32 : START_POSITION.y - 29,
        width: 36,
        height: 36,
    });
};

export const handlePlayerCollision = (setPlayerPosition: React.Dispatch<React.SetStateAction<ElementPosition>>, gameConst: GameConstantsProps, gameLogic: GAMELOGIC, setGameLogic: React.Dispatch<React.SetStateAction<GAMELOGIC>>) => {
    if (gameConst.start && !gameLogic.gameover) {
        setGameLogic((prevGameLogic) => ({
            ...prevGameLogic,
            Health: prevGameLogic.Health - 1,
        }));

        respawnPlayer(setPlayerPosition, gameConst);
    };
};

export const movePlayerBullets = (setPlayerBulletPosition: React.Dispatch<React.SetStateAction<ElementPosition[]>>, enemies: ElementPosition[], collide: (element1: ElementPosition, element2: ElementPosition) => boolean) => {
    setPlayerBulletPosition((bullets) =>
        bullets.map((bullet) => ({
            x: bullet.x - 5,
            y: bullet.y,
            width: bullet.width,
            height: bullet.height,
            collided: enemies.some((enemy) => collide(enemy, bullet)),
        })).filter((bullet) => {
            if (bullet.x < 1) {
                return false;
            }

            if (bullet.y < 0 || bullet.y > 604) {
                return false;
            }

            return true;
        })
    );
};