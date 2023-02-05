require('dotenv').config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const Person = require('./models/Person');
const app = express();

// json middleware should be one of the first loaded
app.use(express.json());
app.use(express.static('build'));
app.use(cors());

// Request logger: tiny + post request.body
app.use(morgan((tokens, req, res) =>
    [tokens.method(req, res),
     tokens.url(req, res),
     tokens.status(req, res),
     tokens.res(req, res, 'content-length'), '-',
     tokens['response-time'](req, res), 'ms',
     (tokens.method(req, res) === "POST") ? JSON.stringify(req.body) : ""
    ].join(' ')));


// const unknownEndpoint = (request, response) => {
//   response.status(404).send({ error: 'unknown endpoint' })
// }

// app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

    next(error);
}

// This has to be the last middleware loaded
app.use(errorHandler);

let persons = [
    {
	"id": 1,
	"name": "Arto Hellas",
	"number": "040-123456"
    },
    {
	"id": 2,
	"name": "Ada Lovelace",
	"number": "39-44-5323523"
    },
    {
	"id": 3,
	"name": "Dan Abramov",
	"number": "12-43-234345"
    },
    {
	"id": 4,
	"name": "Mary Poppendieck",
	"number": "39-23-6423122"
    }
];

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
	response.json(persons);
	// mongoose.connection.close()
    });
})

app.get("/info", (request, response) =>
    response.send(`
<p>Phonebook has info for ${persons.length} people</p>
<p>${Date()}</p>`
	    ));

// Pre-database
// const id = Number(request.params.id);
// const person = persons.find(person => person.id === id);
// return person ? res.json(person) : res.status(404).end();
app.get("/api/persons/:id", (request, response, next) => {
    const id = request.params.id;
    return Person.findById(id)
	.then(person => person ? response.json(person) : response.status(404).end())
	.catch(error => next(error))
});


// Pre-database
// const id = Number(request.params.id);
// persons = persons.filter(person => person.id !== id);
// return response.status(204).end();
app.delete("/api/persons/:id", (request, response) => {
    const id = request.params.id;
    Person.findByIdAndRemove(id)
	.then(result => response.status(204).end())
	.catch(error => next(error))
});

// const generateId = () => {
//     return Math.floor(Math.random() * 100000);
// };

app.post("/api/persons", (request, response) => {
    const body = request.body;
    if (!body.name || !body.number)
	return response.status(404).json({"error": "Name and/or number is missing!"});

    if (persons.some(person => person.name === body.name))
	return response.status(409).json({"error": `${body.name} already exists!`})

    // body.id = generateId();

    const newPerson = new Person({
	name: body.name,
	number: body.number
    })

    // persons = persons.concat(newPerson);
    // return response.json(body);
    newPerson.save().then(savedPerson => response.json(savedPerson));
})


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Started server on port ${PORT}.`));
