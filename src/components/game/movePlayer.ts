import { GameConstantsProps } from "./gameConstants";
import { ElementPosition } from "./space-invader";

export const useMovePlayer = (pressedKeys: Record<string, boolean>, setPlayerPosition: React.Dispatch<React.SetStateAction<ElementPosition>>, gameConst: GameConstantsProps) => {

    const movePlayer = () => {
        setPlayerPosition((prevPosition) => {
            let newX = prevPosition.x;
            let newY = prevPosition.y;

            if (pressedKeys['ArrowRight']) {
                newY = gameConst.Level === 1? Math.min(prevPosition.y + 5, 597 - prevPosition.height): gameConst.Level === 3? Math.min(prevPosition.y + 5, 605 - prevPosition.height): Math.min(prevPosition.y + 5, 602 - prevPosition.height);
            }

            if (pressedKeys['ArrowLeft']) {
                newY = gameConst.Level === 1? Math.max(prevPosition.y - 5, -5): gameConst.Level === 3? Math.max(prevPosition.y - 5, -6): Math.max(prevPosition.y - 5, -10);
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
