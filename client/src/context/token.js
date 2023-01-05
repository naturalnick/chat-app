import { createContext } from "react";

export const token = localStorage.getItem("token");
export const TokenContext = createContext();
