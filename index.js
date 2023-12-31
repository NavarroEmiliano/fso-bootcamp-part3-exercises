/* eslint-disable no-unused-vars */
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(cors())
app.use(express.json())
app.use(express.static('dist'))

morgan.token('body', (request, response) => JSON.stringify(request.body))
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
)

app.get('/api/persons', async (request, response, next) => {
  try {
    const result = await Person.find({})
    if (result.length) {
      response.json(result)
    } else {
      throw new Error('Base de datos vacía.')
    }
  } catch (error) {
    next(error)
  }
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.code === 11000) {
    return response.status(409).send({
      error:
        'The resource already exists in the database. Duplicates are not allowed.',
    })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({
      error: error.errors.number
        ? error.errors.number.message
        : error.errors.name.message,
    })
  }

  next(error)
}

app.get('/api/persons/:id', async (request, response, next) => {
  try {
    const id = request.params.id
    const person = await Person.findById(id)
    if (person) {
      response.json(person)
    } else {
      response.status(404).end
    }
  } catch (error) {
    next(error)
  }
})

app.get('/info', async (request, response, next) => {
  try {
    const persons = await Person.find({})
    const numbers = persons.length
    const date = new Date()
    response.send(`<h3>Phonebook has info for ${numbers} people</h3>
    <h3>${date}</h3>`)
  } catch (error) {
    next(error)
  }
})

app.delete('/api/persons/:id', async (request, response, next) => {
  try {
    const id = request.params.id
    const deletedPerson = await Person.findByIdAndDelete(id)
    if (deletedPerson) response.status(204).end()
  } catch (error) {
    next(error)
  }
})

app.put('/api/persons/:id', async (request, response, next) => {
  try {
    const body = request.body
    const person = {
      name: body.name,
      number: body.number,
    }

    const updatedPerson = await Person.findByIdAndUpdate(
      request.params.id,
      person,
      {
        new: true,
      }
    )

    if (updatedPerson) {
      response.json(updatedPerson)
    } else {
      response.status(404).json({ error: 'Person not found' })
    }
  } catch (error) {
    next(error)
  }
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body
  const personToSave = new Person({
    name: body.name,
    number: body.number,
  })

  personToSave
    .save()
    .then((personSaved) => personSaved.toJSON())
    .then((savedAndFormattedPerson) => response.json(savedAndFormattedPerson))
    .catch((error) => next(error))
})

app.use(errorHandler)

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running in port ${PORT}`)
})
