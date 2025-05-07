/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "./api.service.ts";
import {
  credentials,
  registrationDetails,
  response,
} from "../interfaces/auth.interfaces";
// import { getToast } from "./toasts.service.ts";
import { useAuth } from "@/lib/auth-context.tsx";

export default class AuthService {
  
  async login(credentials: credentials): Promise<response> {
    return api
      .post("auth/login", credentials)
      .then((response: any) => {
        if (response.data.data.token) {
          localStorage.setItem("token", response.data.data.token);
        }
        return response.data;
      })
      .catch((err) => {
        console.log(err);
        return err.response.data;
      });
  }

  async logout(): Promise<boolean> {
    return api
      .get("/auth/logout", {
        headers: {
          Authorization: `Bearer ${this.getAccessToken()}`,
        },
      })
      .then((_response: any) => {
        return true;
      })
      .catch((_err) => {
        // getToast("error", _err?.response?.data?.message || "failed to fetch");
        // if(_err?.response.)
        return false;
      });
  }

  async isAuthenticated(): Promise<boolean> {
    return api
      .get("/auth/verify-user", {
        headers: {
          Authorization: `Bearer ${this.getAccessToken()}`,
        },
      })
      .then((_response: any) => {
        return true;
      })
      .catch((_err) => {
        // getToast("error", _err?.response?.data?.message || "failed to fetch");
        // if(_err?.response.)
        return false;
      });
  }

  async isAdmin(): Promise<boolean> {
    return api
      .get("/auth/verify-admin", {
        headers: {
          Authorization: `Bearer ${this.getAccessToken()}`,
        },
      })
      .then((_response: any) => {
        return true;
      })
      .catch((_err) => {
        return false;
      });
  }
  async refreshUserDetails(): Promise<response> {
    return api
      .get("/auth/refresh-user", {
        headers: {
          Authorization: `Bearer ${this.getAccessToken()}`,
        },
      })
      .then((response: any) => {
        if (response.data.data.token) {
          localStorage.setItem("token", response.data.data.token);
        }
        return response.data;
      })
      .catch((err) => {
        console.log(err);
        return err.response.data;
      });
  }

  getAccessToken() {
    const token: string | null = localStorage.getItem("token");
    return token;
  }

  async register(user: registrationDetails): Promise<response> {
    return api
      .post<response, response>("auth/register", user)
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        console.log(err);
        return err.response.data;
      });
  }
  
  async changePassword(data: {
    oldPassword: string;
    newPassword: string;
  }): Promise<response> {
    return api
      .post<response, response>("auth/change-password", data, {
        headers: {
          Authorization: `Bearer ${this.getAccessToken()}`,
        },
      })
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        console.log(err);
        return err.response.data;
      });
  }
}
