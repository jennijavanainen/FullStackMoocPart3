require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const mongoose = require("mongoose");

app.use(express.json())
app.use(cors())
app.use(express.static('build'))

morgan.token('body', (req) => {
    return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let people = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: 4,
        name: "Mary Poppendick",
        number: "39-23-6423122"
    },
]


const randomNumber = () => {
    return Math.floor(Math.random()* 500)
}

app.get('/', (req, res) => {
    res.send('<h1>Hello World</h1>')
})

app.get('/api/persons', (req, res) => {
    Person.find({}).then(result => {
        res.json(result)
        //mongoose.connection.close()
    })
})

app.post('/api/persons', (req, res) => {
    const body = req.body

    if (!body.name) {
        return res.status(400).json({
            error: 'name missing'
        })
    } else if (!body.number) {
        return res.status(400).json({
            error: 'number missing'
        })
    } else if (people.map(person => person.name).includes(body.name)) {
        return res.status(400).json({
            error: 'name must be unique'
        })
    }
    const person = new Person({
        id: randomNumber(),
        name: body.name,
        number: body.number
    })
    console.log(person)
    person.save().then(savedPerson => {
        res.json(savedPerson)
    })
})

app.get('/api/persons/:id', (req, res) => {
    Person.findById(req.params.id).then(person => {
        res.json(person)
    }).catch ((error) => {
        res.status(404).end()
    })

    /*
    const id = Number(req.params.id)
    const person = people.find(person => person.id === id)
    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
     */
})

app.get('/info', (req, res) => {
    res.send(`<p>Phonebook has info for ${people.length} people</p>
                    <p>${ new Date()}</p>`)
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    people = people.filter(note => note.id !== id)

    res.status(204).end()
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})


