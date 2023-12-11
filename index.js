const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");

app.use(cors());
app.use(express.json());
app.use(express.static("dist"));

const randomId = () => {
  return Math.floor(Math.random() * 1000);
};

morgan.token("body", (req, res) => JSON.stringify(req.body));
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

app.get("/api/persons", async (request, response) => {
  try {
    const result = await Person.find({});
    if (result.length) {
      response.json(result);
    } else {
      throw new Error("Base de datos vacía.");
    }
  } catch (error) {
    response.status(404).json({ error: error.message });
  }
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

app.post("/api/persons", async (request, response) => {
  const body = request.body;

  try {
    if (!body.name || !body.number) {
      return response.status(400).json({
        error: "content missing",
      });
    }
    const noteToSave = new Person({
      name: body.name,
      number: body.number,
    });
    const person = await noteToSave.save();
    return response.json(person);
  } catch (error) {
    return response.status(404).json({ error: error.message });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running in port ${PORT}`);
});
