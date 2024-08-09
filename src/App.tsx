// src/App.tsx

import { useEffect, useState, FormEvent } from 'react'
import { remult } from 'remult'
import { Task } from './shared/Task'
import { TasksController } from './shared/TasksController'

const taskRepo = remult.repo(Task)

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTaskTitle, setNewTaskTitle] = useState("")

  const addTask = async (e: FormEvent) => {
    e.preventDefault()
    try {
      //const newTask = await taskRepo.insert({ title: newTaskTitle })
      await taskRepo.insert({ title: newTaskTitle })
      //setTasks([...tasks, newTask])
      setNewTaskTitle("")
    } catch (error: any) {
      alert((error as { message: string }).message)
    }
  }

  const setAllCompleted = async( completed: boolean) => {
    // for (const task of await taskRepo.find()) {
    //   await taskRepo.save({ ...task, completed })
    // }
    await TasksController.setAllCompleted(completed)
  }

  // Limit number of fetched tasks to 20
  // Order by creation date so older tasks up top
  //** .liveQuery allows for realtime updated live query subscription for both initial data fetching and subsequent state changes */
  useEffect(() => {
    return taskRepo
      .liveQuery({
        limit: 20,
        orderBy: { createdAt: "asc"}
      })
    .subscribe(info => setTasks(info.applyChanges))
  }, [])
  return (
    <div>
      <h1>To Do List</h1>
      <main>
        {taskRepo.metadata.apiInsertAllowed() && (
        <form onSubmit={addTask}>
          <input
            value={newTaskTitle}
            placeholder="What task would you like to add?"
            onChange={e => setNewTaskTitle(e.target.value)}
          />
          <button>Add</button>
        </form>
        )}

        {tasks.map((task) => {
          // CRUD functions
          const setTask = (value: Task) =>
            setTasks(tasks => tasks.map(t => (t === task ? value : t)))

          const setCompleted = async (completed: boolean) =>
            //setTask(await taskRepo.save({...task, completed}))
            await taskRepo.save({ ...task, completed })

          const setTitle = (title:string) => setTask({...task, title})

          const saveTask = async () => {
            try {
              //setTask(await taskRepo.save(task))
              await taskRepo.save(task)
            } catch (error: any) {
              alert((error as { message: string }).message)
            }
          }

          const deleteTask = async () => {
            try {
              await taskRepo.delete(task)
              //setTasks(tasks.filter(t => t !== task))
            } catch (error: any) {
              alert((error as { message: string }).message)
            }
          }
          
          return (
            <div key={task.id}>
              <input type="checkbox" checked={task.completed} onChange={e => setCompleted(e.target.checked)}/>
              <input value={task.title} onChange={e => setTitle(e.target.value)} />
              <button onClick={saveTask}>Save</button>
              {taskRepo.metadata.apiDeleteAllowed(task) && (
              <button onClick={deleteTask}>Delete</button>
              )}
            </div>
            
          )
        })}
        <div>
          <button onClick={() => setAllCompleted(true)}>Set All Completed</button>
          <button onClick={() => setAllCompleted(false)}>Set All Uncompleted</button>
        </div>
      </main>
    </div>
  )
}