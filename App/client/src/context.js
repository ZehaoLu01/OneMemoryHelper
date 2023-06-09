import { createContext } from "react";

const authorizationContext = createContext({ isAuthorized: false });

export { authorizationContext };
