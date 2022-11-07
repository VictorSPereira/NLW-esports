import express, { request } from "express";
import { PrismaClient } from "@prisma/client"
import { convertHourToMinutes } from "./utils/convert-hour-in-minutes";
import { convertMinutesToHour } from "./utils/convert-Minutes-To-Hour";

const app = express()
const prisma = new PrismaClient()
app.use(express.json())

app.get('/games', async (request, response) => {
    const games = await prisma.game.findMany({
        include: {
            _count: {
                select: {
                    ads: true
                }
            }
        }
    })
    return response.json(games)
})

app.post('/games/:id/ads', async (request, response) => {
    const gameId : any = request.params.id
    const body : any = request.body

    const ad = await prisma.ad.create({
        data: {
            gameId,
            name: body.name,
            yearsPlaying: body.yearsPlaying,
            discord: body.discord,
            weekDays: body.weekDays.join(','),
            hourEnd: convertHourToMinutes(body.hourEnd),
            hourStart: convertHourToMinutes(body.hourStart),
            useVoiceChanel: body.useVoiceChanel
        }
    })
    console.log(ad, 'teste')
    return response.status(201).json(ad)
})

app.get('/games/:id/ads', async (request, response) => {
    const gameId = request.params.id

    const ads = await prisma.ad.findMany({
        select: {
            id: true,
            name: true,
            weekDays: true,
            useVoiceChanel: true,
            yearsPlaying: true,
            hourEnd: true,
            hourStart: true
        },
        where: {
            gameId
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    return response.json(ads.map(ad => {
        return{
        ...ad,
        weekDays: ad.weekDays.split(','),
        hourStart: convertMinutesToHour(ad.hourStart),
        hourEnd: convertMinutesToHour(ad.hourEnd)
    }
    }))
})

app.get('/ads/:id/discord', async (request, response) => {
    const adId = request.params.id

    const ad = await prisma.ad.findFirstOrThrow({
        select: {
            discord: true
        },
        where: {
            id: adId
        }
    })
    return response.json({
        discord: ad.discord
    })
})

app.listen("3333", () => console.log("Server On"))