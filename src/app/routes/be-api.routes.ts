import { beApiUrl } from "../../environment";

const taskRouteGroup : string = '/api/tasks';
const authRouteGroup : string = '/api/auth';

export const beApiRoutes = {
    essentialTaskData : beApiUrl + taskRouteGroup + '/essential-task-data',
    tasks : beApiUrl + taskRouteGroup,
    login : beApiUrl + authRouteGroup + '/login',
    logout : beApiUrl + authRouteGroup + '/logout',
    authCheck : beApiUrl + authRouteGroup + '/check',
    refreshToken : beApiUrl + authRouteGroup + '/refresh'
}
