import express, { request } from "express";

const app = express()

app.get('/games', (request, response) => {
    return response.json([])
})

app.post('/ads', (request, response) => {
    return response.status(201).json([])
})

app.get('/games/:id/ads', (request, response) => {
    return response.json([

    ])
})

app.get('/games/:id/discord', (request, response) => {
    return response.json([
        
    ])
})