export enum Role {
    user = "user",
    manager = "manager",
    admin = "admin"
}

export interface User {
    id: string,
    username: string,
    password: string,
    firstName: string,
    lastName: string,
    roles: Role[]
}

export interface UserData {
    id: string,
    firstName: string,
    lastName: string,
    roles: Role[]
}

export interface UserRole {
    role: string, 
    enabled: boolean
}