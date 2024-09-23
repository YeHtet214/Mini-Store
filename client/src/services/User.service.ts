import axios from "axios";
import { AuthResponse, authType, userInfo } from "../types/types";
import { jwtDecode } from "jwt-decode";

export const getCurrentUser = async () => {
      const token = localStorage.getItem('token');

      if (token) console.log(jwtDecode(token));
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
            console.log("Register response data: ", res);
            return res.data;
      } catch (error) {
            console.log(error);
      }
}

interface UserAuthProps {
      data: userInfo;
      authType: authType;
      handleResponse: (response: AuthResponse) => boolean;
}

export const authenticateUser = async ({data, authType, handleResponse}: UserAuthProps): Promise<boolean> => {
      let response: AuthResponse;
      if (authType === 'login') { // check if the user loggin or register
            response = await loginUser({...data});
      } else { // register user
            response = await registerUser({...data});
      }

      if (handleResponse(response)) {
            const { token, user_id } = response;
            if (token) localStorage.setItem('token', token);
            if (user_id) localStorage.setItem('user_id', user_id);
            return true;
      }
      return false;
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