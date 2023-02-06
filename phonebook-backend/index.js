require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const Person = require('./models/Person')
const app = express()

// json middleware should be one of the first loaded
app.use(express.json())
app.use(cors())
app.use(express.static('build'))

// Request logger: tiny + post request.body
const requestLogger = (tokens, req, res) =>
  [tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    (tokens.method(req, res) === 'POST') ? JSON.stringify(req.body) : ''
  ].join(' ')

app.use(morgan(requestLogger))

app.get('/api/persons', (request, response, next) =>
  Person.find({})
    .then(persons => response.json(persons))
    .catch(error => next(error)))

app.get('/info', (request, response, next) => {
  Person.find().exec((error, results) => {
    if (error) return next(error)
    var count = results.length
    response.send(`
<p>Phonebook has info for ${count} people</p>
<p>${Date()}</p>`)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  return Person.findById(id)
    .then(person => person ? response.json(person) : response.status(404).end())
    .catch(error => next(error))
})


app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Person.findByIdAndRemove(id)
    .then(() => response.status(204).end())
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  const { name, number } = request.body
  Person
    .findByIdAndUpdate(id, { name, number }, { new: true, runValidators: true, context: 'query' })
    .then(updatedPerson => response.json(updatedPerson))
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body
  if (!body.name || !body.number)
    return response.status(404).json({ 'error': 'Name and/or number is missing!' })

  // Prevent adding already existing names
  Person.findOne({ name: body.name }).exec((error, person) => {
    if (error) return next(error)
    if (person) return response.status(409).json(
      { 'error': `${body.name} already exists!` })
    // else
    const newPerson = new Person({
      name: body.name,
      number: body.number
    })
    newPerson.save()
      .then(savedPerson => response.json(savedPerson))
      .catch(error => next(error))
  })
})

// Needs to go after app.get, etc. but before errorHandler
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'Unknown endpoint 404' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'Malformatted ID 400' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

// This has to be the last middleware loaded
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Started server on port ${PORT}.`))
