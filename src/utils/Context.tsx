import { Dispatch, SetStateAction, createContext } from "react";

export const UserContext = createContext<[undefined | 'passport' | 'metamask', Dispatch<SetStateAction<undefined | 'passport' | 'metamask'>>]>(([undefined, () => {}]));
