import { handlePlayerCollision } from "./Player";
import { GameConstantsProps } from "./gameConstants";
import { GAMELOGIC } from "./gameLogic";
import { ElementPosition } from "./space-invader";

export const moveEnemyBullets = (setPlayerPosition: React.Dispatch<React.SetStateAction<ElementPosition>>, playerPosition: ElementPosition, setEnemyBullets: React.Dispatch<React.SetStateAction<{ x: number; y: number; width: number; height: number; isFired: boolean, initialX: number }[]>>, gameConst: GameConstantsProps, gameLogic: GAMELOGIC, setGameLogic: React.Dispatch<React.SetStateAction<GAMELOGIC>>, collide: (element1: ElementPosition, element2: ElementPosition) => boolean) => {
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
                        handlePlayerCollision(setPlayerPosition, gameConst, gameLogic, setGameLogic);
                    }
                    return bullet.x >= 0 && bullet.x + bullet.height < 504 && !bullet.collided;
                })
        );
    }
};

const enemyCollide = (element1: ElementPosition, element2: ElementPosition) => {
    return (
      element1.x < element2.x + element2.width &&
      element1.x + element1.width > element2.x &&
      (element1.y + 2) < (element2.y) + element2.height &&
      element1.y + element1.height > element2.y
    );
  };

export const moveEnemiesAndFireBullets = (ENEMY_BULLET_HEIGHT: number, ENEMY_BULLET_WIDTH: number, ENEMY_FIRE_INTERVAL: number, enemyCanFire: boolean, setEnemyCanFire: React.Dispatch<React.SetStateAction<boolean>>, setPlayerBulletPosition: React.Dispatch<React.SetStateAction<ElementPosition[]>>, playerBulletsPosition: ElementPosition[], setPlayerPosition: React.Dispatch<React.SetStateAction<ElementPosition>>, setEnemies: React.Dispatch<React.SetStateAction<ElementPosition[]>>, playerPosition: ElementPosition, setEnemyBullets: React.Dispatch<React.SetStateAction<{ x: number; y: number; width: number; height: number; isFired: boolean, initialX: number }[]>>, gameConst: GameConstantsProps, gameLogic: GAMELOGIC, setGameLogic: React.Dispatch<React.SetStateAction<GAMELOGIC>>, collide: (element1: ElementPosition, element2: ElementPosition) => boolean) => {
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
                    handlePlayerCollision(setPlayerPosition, gameConst, gameLogic, setGameLogic);
                    return null;
                }

                playerBulletsPosition.some((bullets) => {
                    if (enemyCollide(updatedEnemy, bullets)) {
                        setEnemies((enemies) => enemies.filter((enemy) => !enemyCollide(enemy, bullets)));
                        setPlayerBulletPosition(playerBullets => playerBullets.filter((playerbullets) => !enemyCollide(updatedEnemy, playerbullets) || !enemyCollide(updatedEnemy, bullets)))
                        setGameLogic((prevGameLogic) => ({
                            ...prevGameLogic,
                            TotalPoints: prevGameLogic.TotalPoints + (0.5),
                        }));
                    }
                })

                if (
                    Math.random() < (gameConst.Level === 1 ? (0.025 - gameConst.enemyFire) : gameConst.Level === 2 ? (0.032 - gameConst.enemyFire) : (0.0345 - gameConst.enemyFire))
                    && enemyCanFire
                ) {
                    setEnemyCanFire(false);

                    setTimeout(() => {
                        setEnemyCanFire(true);
                    }, ENEMY_FIRE_INTERVAL);

                    setEnemyBullets((enemyBullets) => [
                        ...enemyBullets,
                        { x: updatedEnemy.x, y: updatedEnemy.y, width: ENEMY_BULLET_WIDTH, height: ENEMY_BULLET_HEIGHT, isFired: false, initialX: updatedEnemy.x },
                    ]);
                }

                return updatedEnemy;
            });

            const filteredEnemies = updatedEnemies.filter((enemy) => enemy !== null) as ElementPosition[];

            return filteredEnemies;
        });
    }
};