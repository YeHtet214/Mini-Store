import React, { createContext, PropsWithChildren, Dispatch, useContext, useEffect, useState, SetStateAction } from "react";
import { User } from "../types/types";
import * as UserService from "../services/User.service";

interface UserContextType {
      currentUser: User | undefined;
      setCurrentUser: Dispatch<SetStateAction<User | undefined>>;
      users: User[] | [];
      isLoggedIn: boolean;
      setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
      addUser: (user: User) => void;
      deleteUser: (userId: number) => void;
}

const defaultUserContext: UserContextType = {
      currentUser: undefined,
      setCurrentUser: () => {},
      users: [],
      isLoggedIn: false,
      setIsLoggedIn: () => {},
      addUser: () => {},
      deleteUser: () => {},
}

const UserContext = createContext<UserContextType>(defaultUserContext);

const UserProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
      const [currentUser, setCurrentUser] = useState<User>(); //  {token: localStorage.getItem('token') ,user_id:  Number(localStorage.getItem('user_id'))}
      const [users, setUsers] = useState<User[]>([]);
      const [isLoggedIn, setIsLoggedIn] = useState<boolean>(localStorage.getItem('token') ? true : false);

      useEffect(() => {
            console.log("User logged IN: ", isLoggedIn);
            if (isLoggedIn) {
                  UserService.getCurrentUser().then((data: User) => setCurrentUser(data));
                  UserService.getAllUsers().then((data: User[]) => setUsers(data));
            }
      }, [isLoggedIn]);

      useEffect(() => {
            console.log("Current User", currentUser);
      }, [currentUser])

      useEffect(() => {
            console.log(users);
      }, [users])

      const addUser = (user: User) => {
            setUsers(prev => [...prev, user]);
      }

      const deleteUser = (userId: number) => {
            console.log("Delete user id", userId)
            setUsers(prevUsers => prevUsers.filter(prevUser => prevUser.user_id != userId));
      }

      return (
            <UserContext.Provider value={{ currentUser, setCurrentUser, users, addUser, deleteUser, isLoggedIn, setIsLoggedIn }}>
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