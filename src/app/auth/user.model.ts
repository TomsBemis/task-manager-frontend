export interface User {
    id: string,
    username: string,
    password: string,
    firstName: string,
    lastName: string,
}

export interface LoginCredentials { 
    username : string, 
    password : string
}

export interface AuthResponse {
    accessToken: string,
    refreshToken: string,
    user: User,
}