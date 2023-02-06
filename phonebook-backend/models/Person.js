const mongoose = require('mongoose')
const url = process.env.MONGODB_URI

// const url = `mongodb+srv://fullstack:${password}@cluster0.t9tjdq4.mongodb.net/phonebookApp?retryWrites=true&w=majority`;

mongoose.set('strictQuery', false)
mongoose.connect(url)
  .then(() => {
    console.log('Connected to MongoDB')
  }).catch((error) => {
    console.log('Failed connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    minLength: 8,
    required: true,
    validate: function(str) {
      return /^\d{2,3}-\d{1,}$/.test(str)
    }
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Person = mongoose.model('Person', personSchema)

module.exports = Person
