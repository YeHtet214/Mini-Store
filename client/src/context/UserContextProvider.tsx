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
      updateUser: (user: User) => void;
}

const defaultUserContext: UserContextType = {
      currentUser: undefined,
      setCurrentUser: () => {},
      users: [],
      isLoggedIn: false,
      setIsLoggedIn: () => {},
      addUser: () => {},
      deleteUser: () => {},
      updateUser: () => {},
}

const UserContext = createContext<UserContextType>(defaultUserContext);

const UserProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
      const [currentUser, setCurrentUser] = useState<User>(); //  {token: localStorage.getItem('token') ,user_id:  Number(localStorage.getItem('user_id'))}
      const [users, setUsers] = useState<User[]>([]);
      const [isLoggedIn, setIsLoggedIn] = useState<boolean>(localStorage.getItem('token') ? true : false);

      useEffect(() => {
            if (isLoggedIn) {
                  UserService.getCurrentUser().then((data: User) => setCurrentUser(data));
                  UserService.getAllUsers().then((data: User[]) => setUsers(data));
            }
      }, [isLoggedIn]);

      const addUser = (user: User) => {
            setUsers(prev => [...prev, user]);
      }

      const updateUser = (updatedUser: User) => {
            setUsers(prev => prev.map(user => {
                  if (user.user_id !== updatedUser.user_id) return user;
                  return updatedUser;
            }))
      }

      const deleteUser = (userId: number) => {
            setUsers(prevUsers => prevUsers.filter(prevUser => prevUser.user_id != userId));
      }

      return (
            <UserContext.Provider value={{ currentUser, setCurrentUser, users, addUser, deleteUser, updateUser, isLoggedIn, setIsLoggedIn }}>
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