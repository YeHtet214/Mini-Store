import axios from "axios";
import { AuthResponse, authType, User, userInfo } from "../types/types";
import { jwtDecode } from "jwt-decode";

const BASE_URL = "https://ministore-server.vercel.app/api";

export const getCurrentUser = async () => {
      const token = localStorage.getItem('token');
      console.log("token", token);

      const axiosInstance = axios.create({
            headers: {
                  'Authorization': `Bearer ${token}`
            }
      });

      try {
            const res = await axiosInstance.get(`${BASE_URL}/userProfile`);
            console.log("Current User: ", res.data)
            return res.data;
      } catch (error) {
            console.log(error);
      }
}

export const getAllUsers = async () => {
      try {
            const res = await axios.get(`${BASE_URL}/manageUsers`);
            return res.data;
      } catch (error) {
            console.log(error);
      }
}

export const loginUser = async (data: userInfo) => {
      try {
            const res = await axios.post(`${BASE_URL}/login`, {...data});
            return res.data;
      } catch (error: any) {
            if (error.response) {
                  return error.response.data;
            }
      }
}

export const registerUser = async (data: userInfo) => {
      console.log("Registering user: ", data);
      try {
            const res = await axios.post(`${BASE_URL}/register`, {...data});
            return res.data;
      } catch (error) {
            console.log(error);
      }
}

interface UserAuthProps {
      userInput: userInfo;
      authType?: authType;
      handleResponse: (response: AuthResponse) => boolean;
}

export const authenticateUser = async ({userInput, authType="login", handleResponse}: UserAuthProps): Promise<boolean> => {
      let response: AuthResponse;
      if (authType === 'login') { // check if the user loggin or register
            response = await loginUser({...userInput});
      } else { // register user
            response = await registerUser({...userInput});
      }

      console.log("Auth Response: ", response);

      if (handleResponse(response)) {
            const { token, user_id } = response;
            if (token) localStorage.setItem('token', token);
            if (user_id) localStorage.setItem('user_id', user_id);
            return true;
      }
      return false;
}

export const createNewUser = async (user: User) => {
      try {
            const res = await axios.post(`${BASE_URL}/manageUsers`, user);
            return res.data;
      } catch (error) {
            console.log(error);
      }
}

export const updateUser = async (user: User) => {
      try {
            const res = await axios.put(`${BASE_URL}/manageUsers`, user);
            return res.data;
      } catch (error) {
            console.log(error);
      }
}

export const deleteUser = async (userId: number) => {
      try {
            const res = await axios.delete(`${BASE_URL}/manageUsers`, { data: { userId } });
            return res.data;
      } catch (error) {
            console.log(error);
      }
}

export const isAuthenticated = () => {
      const token = localStorage.getItem('token');
      try {
            return token ? jwtDecode(token) : false;
      } catch(error) {
            return false;
      }
}

interface JwtPayload {
      iat: number;
      id: number;
      role: string;
}

export const hasRole = (role: string) => {
      const token = localStorage.getItem('token');
      if (!token) return false;

      try {
            const decodedToken = jwtDecode<JwtPayload>(token);
            return decodedToken.role === role;
      } catch(error) {
            return false;
      }
}