import { useState } from "react";
import { START_POSITION } from "./constants";
import { useGameLogic } from "./gameLogic";
import { ElementPosition } from "./space-invader";

export const useMovePlayer = (pressedKeys: Record<string, boolean>) => {
    const { gameLogic } = useGameLogic();

    const [playerPosition, setPlayerPosition] = useState<ElementPosition>({
        x: START_POSITION.x,
        y: START_POSITION.y,
        width: 50,
        height: 50,
    });

    const movePlayer = () => {
        setPlayerPosition((prevPosition) => {
            let newX = prevPosition.x;
            let newY = prevPosition.y;

            if (pressedKeys['ArrowRight']) {
                newY = Math.min(prevPosition.y + 5, 560 - prevPosition.height);
            }

            if (pressedKeys['ArrowLeft']) {
                newY = Math.max(prevPosition.y - 5, 0);
            }

            if (gameLogic.Level > 1) {
                if (pressedKeys['ArrowUp']) {
                    newX = Math.max(prevPosition.x - 5, 0);
                }

                if (pressedKeys['ArrowDown']) {
                    newX = Math.min(prevPosition.x + 5, 680 - prevPosition.width);
                }
            }

            return { ...prevPosition, x: newX, y: newY };
        });
    };

    return { playerPosition, movePlayer };
};
