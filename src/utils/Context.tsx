import { Dispatch, SetStateAction, createContext } from "react";

export const UserContext = createContext<[boolean, Dispatch<SetStateAction<boolean>>]>(([false, () => {}]));
