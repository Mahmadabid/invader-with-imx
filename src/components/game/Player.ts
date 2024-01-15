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
                newY = gameConst.Level === 1 ? Math.min(prevPosition.y + 5, 597 - prevPosition.height) : gameConst.Level === 3 ? Math.min(prevPosition.y + 5, 605 - prevPosition.height) : Math.min(prevPosition.y + 5, 602 - prevPosition.height);
            }

            if (pressedKeys['ArrowLeft']) {
                newY = gameConst.Level === 1 ? Math.max(prevPosition.y - 5, -5) : gameConst.Level === 3 ? Math.max(prevPosition.y - 5, -6) : Math.max(prevPosition.y - 5, -10);
            }

            if (gameConst.Level > 1) {
                if (pressedKeys['ArrowUp']) {
                    newX = Math.max(prevPosition.x - 5, 10);
                }

                if (pressedKeys['ArrowDown']) {
                    newX = Math.min(prevPosition.x + 5, 490 - prevPosition.width);
                }
            }

            return { ...prevPosition, x: newX, y: newY };
        });
    };

    return { movePlayer };
};

export const respawnPlayer = (setPlayerPosition: React.Dispatch<React.SetStateAction<ElementPosition>>) => {
    setPlayerPosition({
        x: START_POSITION.x,
        y: START_POSITION.y,
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

        respawnPlayer(setPlayerPosition);
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
            if (bullet.x === 0) {
                return false;
            }

            return true;
        })
    );
};