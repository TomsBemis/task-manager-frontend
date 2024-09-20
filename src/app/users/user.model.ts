import { Option } from "../shared/option.model"

export interface User {
    id: string,
    username: string,
    password: string,
    firstName: string,
    lastName: string,
    roles: string[]
}

export interface LoginCredentials { 
    username : string, 
    password : string
}

export interface LogoutCredentials { 
    username : string, 
    password : string,
    refreshToken: string
}

export interface AuthCredentials {
    accessToken: string,
    refreshToken: string,
    userId: string,
}

export interface LoginResponse {
    user: User,
    authentication: AuthCredentials,
}

export interface UserRole {
    role: Option, 
    enabled: boolean
}

export const initialRoles: {[key: string]: Option} = {
    USER: {
        value: "USER",
        displayName: "Regular user"
    },
    MANAGER: {
        value: "MANAGER",
        displayName: "Manager"
    },
    ADMIN: {
        value: "ADMIN",
        displayName: "Administrator"
    }
};