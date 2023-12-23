import { GameConstantsProps, useGameConstants } from "./gameConstants";
import { ElementPosition } from "./space-invader";

export const useMovePlayer = (pressedKeys: Record<string, boolean>, setPlayerPosition: React.Dispatch<React.SetStateAction<ElementPosition>>, gameConst: GameConstantsProps) => {

    const movePlayer = () => {
        setPlayerPosition((prevPosition) => {
            let newX = prevPosition.x;
            let newY = prevPosition.y;

            if (pressedKeys['ArrowRight']) {
                newY = Math.min(prevPosition.y + 5, 612 - prevPosition.height);
            }

            if (pressedKeys['ArrowLeft']) {
                newY = Math.max(prevPosition.y - 5, 0);
            }

            if (gameConst.Level > 1) {
                if (pressedKeys['ArrowUp']) {
                    newX = Math.max(prevPosition.x - 5, 30);
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
