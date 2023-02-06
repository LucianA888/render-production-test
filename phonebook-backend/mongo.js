const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Password is required')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@cluster0.t9tjdq4.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 5) {
  const name = process.argv[3]
  const number = process.argv[4]

  const person = new Person({
    name: name,
    number: number
  })

  person.save().then(result => {
    console.log(`${result.name} ${result.number} added to the database!`)
    mongoose.connection.close()
  })
} else {
  // Fetch the entries
  Person.find({}).then(result => {
    console.log('Phonebook:')
    result.forEach(person => {
      console.log(person.name, person.number)
    })
    mongoose.connection.close()
  })
}
