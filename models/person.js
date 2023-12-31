/* eslint-disable no-undef */
require('dotenv').config()
const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose
  .connect(url)
  .then(() => {
    console.log('Conectado a la base de datos')
  })
  .catch((error) => console.log(error))

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [3, 'The name must be at least 3 characters.'],
    required: true,
    unique: true,
  },
  number: {
    type: Number,
    validate: {
      validator: (number) => {
        const stringNumber = number.toString()
        return stringNumber.length >= 8
      },
      message: 'The number must be at least 8 digits.',
    },
    required: true,
  },
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('Person', personSchema)
