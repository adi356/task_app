import express, { Router } from 'express'
import type { UserInfo } from 'remult'

const validUsers: UserInfo[] = [
    { id: '1', name: 'Andrew', roles: ["admin"] },
    { id: '2', name: 'Steve'},
]

export const auth = Router()

auth.use(express.json())

auth.post('/api/signIn', (req, res) => {
    const user = validUsers.find((user) => user.name === req.body.username)
    if (user) {
        req.session!['user'] = user 
        res.json(user)
    } else {
        res.status(404).json("Invalid user, try 'Andrew' or 'Steve'")
    }
})

auth.post('/api/signOut', (req, res) => {
    req.session!['user'] = null
    res.json('signed out')
})

auth.get('/api/currentUser', (req, res) => res.json(req.session!['user']))