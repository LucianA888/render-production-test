const mongoose = require('mongoose');
const url = process.env.MONGODB_URI;

// const url = `mongodb+srv://fullstack:${password}@cluster0.t9tjdq4.mongodb.net/phonebookApp?retryWrites=true&w=majority`;

mongoose.set('strictQuery', false);
mongoose.connect(url)
    .then(result => {
	console.log('Connected to MongoDB');
    }).catch((error) => {
	console.log("Failed connecting to MongoDB:", error.message);
    });

const personSchema = new mongoose.Schema({
    name: String,
    number: String
});

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
	returnedObject.id = returnedObject._id.toString();
	delete returnedObject._id;
	delete returnedObject.__v;
    }
})

const Person = mongoose.model('Person', personSchema);

module.exports = Person;
