const express = require('express');
const cors = require('cors');

const {
  v4: uuidv4
} = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const {
    username
  } = request.headers;

  const user = users.find((user) => {
    return user.username === username;
  })

  if (!user) {
    return response.status(404).json({
      error: "username not found!"
    });
  }

  request.user = user;

  return next();

}

app.post('/users', (request, response) => {
  // Complete aqui
  const {
    name,
    username
  } = request.body;

  const userAlredyExists = users.find(user => user.username === username);

  if (userAlredyExists) {
    return response.status(400).json({
      error: "user already exists!"
    })
  }

  const newUser = {
    name,
    username,
    id: uuidv4(),
    todos: []
  }

  users.push(newUser);

  return response.status(201).json(newUser)

});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {
    user
  } = request;

  response.status(201).json(user.todos)
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui

  const {
    deadline,
    title
  } = request.body;

  const {
    user
  } = request;

  const newTodo = {
    done: false,
    title,
    id: uuidv4(),
    deadline: new Date(deadline),
    created_at: new Date()
  }
  user.todos.push(newTodo);

  response.status(201).json(newTodo)

});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {
    title,
    deadline
  } = request.body;

  const {
    user
  } = request;

  const {
    id
  } = request.params

  const todo = user.todos.find(todo => todo.id === id);

  if (!todo) {
    return response.status(404).json({
      error: "Todo not exist!"
    });
  }
  console.log("todo", todo)
  todo.title = title;
  todo.deadline = new Date(deadline).toISOString();

  response.status(201).json(todo);


});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {
    id
  } = request.params;

  const {
    user
  } = request;

  const todo = user.todos.find(todo => todo.id === id)

  if (!todo) {
    return response.status(404).json({
      error: "Todo not found!"
    })
  }

  todo.done = true;

  response.status(201).json(todo)


});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  const {
    id
  } = request.params;

  const {
    user
  } = request;

  const todoIndex = user.todos.findIndex(todo => todo.id === id)

  if (todoIndex < 0) {
    return response.status(404).json({
      error: "todo not found!"
    });
  }

  user.todos.splice(todoIndex, 1);

  return response.status(204).json(user);

});

module.exports = app;