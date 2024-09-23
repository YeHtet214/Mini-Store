import React, { createContext, PropsWithChildren, Dispatch, useContext, useEffect, useState, SetStateAction } from "react";
import { User } from "../types/types";
import * as UserService from "../services/User.service";

interface UserContextType {
      user: User | undefined;
      setUser: Dispatch<SetStateAction<User>>;
      isLoggedIn: boolean;
      setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
}

const defaultUserContext: UserContextType = {
      user: undefined,
      setUser: () => {},
      isLoggedIn: false,
      setIsLoggedIn: () => {}
}

const UserContext = createContext<UserContextType>(defaultUserContext);

const UserProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
      const [user, setUser] = useState<User>({ token: localStorage.getItem('token') ,user_id:  Number(localStorage.getItem('user_id')) });
      const [isLoggedIn, setIsLoggedIn] = useState<boolean>(localStorage.getItem('token') ? true : false);

      useEffect(() => {
            console.log("Login Changed: ", isLoggedIn)
            if (isLoggedIn) {
                  UserService.getCurrentUser().then(data => setUser(data));
            }
      }, [isLoggedIn]);

      return (
            <UserContext.Provider value={{ user, setUser, isLoggedIn, setIsLoggedIn }}>
                  {children}
            </UserContext.Provider>
      )
}

const useUser = () => {
      const context = useContext(UserContext);
      if (!context) {
            console.log("There is no context for user");
            throw new Error("User context should be in the user provider!");
      }
      return context;
}

export { useUser, UserProvider };