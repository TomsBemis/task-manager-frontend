export interface User {
    _id: string,
    username: string,
    password: string,
    firstName: string,
    lastName: string,
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