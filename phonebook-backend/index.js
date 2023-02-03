const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(express.static('build'));

// tiny + post req.body
app.use(morgan((tokens, req, res) =>
    [tokens.method(req, res),
     tokens.url(req, res),
     tokens.status(req, res),
     tokens.res(req, res, 'content-length'), '-',
     tokens['response-time'](req, res), 'ms',
     (tokens.method(req, res) === "POST") ? JSON.stringify(req.body) : ""
    ].join(' ')));

app.use(cors());

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

app.get("/api/persons", (req, res) => res.json(persons));

app.get("/info", (req, res) =>
    res.send(`
<p>Phonebook has info for ${persons.length} people</p>
<p>${Date()}</p>`
	    ));

app.get("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id);
    const person = persons.find(person => person.id === id);
    return person ? res.json(person) : res.status(404).end();
});

app.delete("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id);
    persons = persons.filter(person => person.id !== id);
    return res.status(204).end();
})

const generateId = () => {
    return Math.floor(Math.random() * 100000);
};

app.post("/api/persons", (req, res) => {
    const newPerson = req.body;
    if (!newPerson.name || !newPerson.number)
	return res.status(404).json({"error": "Name and/or number is missing!"});

    if (persons.some(person => person.name === newPerson.name))
	return res.status(409).json({"error": `${newPerson.name} already exists!`})

    newPerson.id = generateId();
    persons = persons.concat(newPerson);
    return res.json(newPerson);
})


app.listen(process.env.PORT || 3001, () => console.log("Started server!"));
