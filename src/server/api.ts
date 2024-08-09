import { remultExpress } from 'remult/remult-express'
import { Task } from "../shared/Task.js"
import { TasksController } from '../shared/TasksController.js'
//import { createPostgresDataProvider } from 'remult/postgres'


export const api = remultExpress({
    entities: [Task],
    admin: true,
    controllers: [TasksController],
    // dataProvider: createPostgresDataProvider({
    //     connectionString: "connection_string_here"
    // }),
    getUser: req => req.session!["user"],
    
})