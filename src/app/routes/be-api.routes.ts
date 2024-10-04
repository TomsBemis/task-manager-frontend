import { beApiUrl } from "../../environment";

const taskRouteGroup : string = '/api/tasks';
const authRouteGroup : string = '/api/auth';
const userRouteGroup : string = '/api/users';

export const beApiRoutes = {
    essentialTaskData : beApiUrl + taskRouteGroup + '/essential-task-data',
    tasks : beApiUrl + taskRouteGroup,
    login : beApiUrl + authRouteGroup + '/login',
    register : beApiUrl + authRouteGroup + '/register',
    logout : beApiUrl + authRouteGroup + '/logout',
    refreshToken : beApiUrl + authRouteGroup + '/refresh',
    users : beApiUrl + userRouteGroup,
}

export const guestBeApiRouteWhitelist = [
    beApiRoutes.login,
    beApiRoutes.register
];
