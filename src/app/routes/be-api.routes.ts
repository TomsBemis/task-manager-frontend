import { beApiUrl } from "../../environment";

export const beApiRoutes = {
    taskTypes : beApiUrl + '/api/task-types',
    taskStatuses : beApiUrl + '/api/task-statuses',
    tasks : beApiUrl + '/api/tasks'
}
