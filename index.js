const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors")

app.use(cors())
app.use(express.json());
app.use(express.static("dist"))

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendick",
    number: "39-23-6423122",
  },
];

const randomId = () => {
  return Math.floor(Math.random() * 1000);
};

morgan.token("body", (req, res) => JSON.stringify(req.body));
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);



app.get("/api/persons", (request, response) => {
  if (!persons.length) {
    return response.status(204).json({
      data: persons,
    });
  }
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const data = persons.find((person) => person.id === id);
  if (data) {
    response.json(data);
  } else {
    response.status(404).end();
  }
});

app.get("/info", (request, response) => {
  const numbers = persons.length;
  const date = new Date();
  response.send(`<h3>Phonebook has info for ${numbers} people</h3>
  <h3>${date}</h3>`);
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  console.log(id);
  persons = persons.filter((person) => person.id !== id);
  response.status(204).end();
});

app.post("/api/persons", (request, response) => {
  const body = request.body;
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  const findName = persons.find(
    (person) =>
      person.name.toLocaleLowerCase() === body.name.toLocaleLowerCase()
  );

  if (findName) {
    return response.status(409).json({
      error: "name must be unique",
    });
  }

  const person = {
    id: randomId(),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);

  response.json(person);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running in port ${PORT}`);
});
