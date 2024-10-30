import axios from "axios";
import { AuthResponse, authType, User, userInfo } from "../types/types";
import { jwtDecode } from "jwt-decode";

export const getCurrentUser = async () => {
      const token = localStorage.getItem('token');

      const axiosInstance = axios.create({
            baseURL: 'http://localhost:5000/auth/user',
            headers: {
                  'Authentication': token
            }
      });

      try {
            const res = await axiosInstance.get(`/profile`);
            return res.data;
      } catch (error) {
            console.log(error);
      }
}

export const getAllUsers = async () => {
      try {
            const res = await axios.get('http://localhost:5000/auth/users/get');
            return res.data;
      } catch (error) {
            console.log(error);
      }
}

export const loginUser = async (data: userInfo) => {
      try {
            const res = await axios.post('http://localhost:5000/auth/login', {...data});
            return res.data;
      } catch (error: any) {
            if (error.response) {
                  return error.response.data;
            }
      }
}

export const registerUser = async (data: userInfo) => {
      try {
            const res = await axios.post('http://localhost:5000/auth/register', {...data});
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
            const res = await axios.post('http://localhost:5000/manageUsers/users/create', user);
            return res.data;
      } catch (error) {
            console.log(error);
      }
}

export const updateUser = async (user: User) => {
      try {
            const res = await axios.put(`http://localhost:5000/manageUsers/users/${user.user_id}/update`, user);
            return res.data;
      } catch (error) {
            console.log(error);
      }
}

export const deleteUser = async (userId: number) => {
      try {
            const res = await axios.delete(`http://localhost:5000/auth/users/${userId}/delete`);
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
            console.log(error);
            return false;
      }
}

export const hasRole = (role: string) => {
      const token = localStorage.getItem('token');
      if (!token) return false;

      try {
            const decodedToken = jwtDecode(token);
            return decodedToken.user.role === role;
      } catch(error) {
            console.log(error);
            return false;
      }
}