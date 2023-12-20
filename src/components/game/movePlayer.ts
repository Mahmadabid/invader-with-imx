import { useGameLogic } from "./gameLogic";
import { ElementPosition } from "./space-invader";

export const useMovePlayer = (pressedKeys: Record<string, boolean>, setPlayerPosition: React.Dispatch<React.SetStateAction<ElementPosition>>) => {
    const { gameLogic } = useGameLogic();

    const movePlayer = () => {
        setPlayerPosition((prevPosition) => {
            let newX = prevPosition.x;
            let newY = prevPosition.y;

            if (pressedKeys['ArrowRight']) {
                newY = Math.min(prevPosition.y + 5, 690 - prevPosition.height);
            }

            if (pressedKeys['ArrowLeft']) {
                newY = Math.max(prevPosition.y - 5, 0);
            }

            if (gameLogic.Level > 1) {
                if (pressedKeys['ArrowUp']) {
                    newX = Math.max(prevPosition.x - 5, 30);
                }

                if (pressedKeys['ArrowDown']) {
                    newX = Math.min(prevPosition.x + 5, 560 - prevPosition.width);
                }
            }

            return { ...prevPosition, x: newX, y: newY };
        });
    };

    return { movePlayer };
};
