const http = require("http");
const Io = require("./utils/Io");
const parser = require("./utils/parser");
// !model
const Todo = require("./models/Todo.js");
// !db
const Todos = new Io("./db/Todos.json");

const getDate = () => {
  return new Date();
};

const clb = async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  const todos = await Todos.read();
  //   ! POST request
  if (req.url === "/todos" && req.method === "POST") {
    try {
      const { text, title } = await parser(req);
      if (text && title) {
        const id = (todos[todos.length - 1]?.id || 0) + 1;
        const current = new Todo(id, title, text, getDate());
        Todos.write([...todos, current]);
        res.writeHead(200);
        res.end(JSON.stringify({ message: "Succeessfully created" }));
      } else {
        throw new Error("Bad request!");
      }
    } catch (error) {
      console.log(error);
      res.writeHead(400);
      res.end(JSON.stringify({ message: error.message }));
    }
  }
  //   ! DELETE request
  if (req.url === "/todos" && req.method === "DELETE") {
    try {
      const { id } = await parser(req);
      const finded = todos.find((todo) => todo.id == id);
      if (id && finded) {
        const current = todos.filter((todo) => todo.id != id);
        Todos.write(current);
        res.end(JSON.stringify({ message: "Todo was deleted successfully" }));
      } else {
        throw new Error("BadRequestError");
      }
    } catch (error) {
      res.writeHead(400);
      res.end(JSON.stringify({ message: error.message }));
    }
  }
  //   ! Put request
  if (req.url === "/todos" && req.method === "PUT") {
    try {
      const { id, text, title } = await parser(req);
      const finded = todos.find((todo) => todo.id == id);
      if ((text || title) && finded) {
        text ? (finded.text = text) : null;
        title ? (finded.title = title) : null;
        Todos.write(todos);
        res.end(JSON.stringify({ message: "Todo was updated successfully" }));
      } else {
        throw new Error("BadRequestError");
      }  
    } catch (error) {
      res.writeHead(400);
      res.end(JSON.stringify({ message: error.message }));
    }
  }
  //   ! Put request completed
  if (req.url === "/todo" && req.method === "PUT") {
    try {
      const { id, completed } = await parser(req);
      const finded = todos.find((todo) => todo.id == id);
      if (id && completed && finded) {
        finded.completed = completed;
        Todos.write(todos);
        // throw new Error()
        res.writeHead(200);
        res.end(JSON.stringify({ message: "Todo was updated successfully" }));
      } else {
        throw new Error("BadRequestError");
      }
    } catch (error) {
      res.writeHead(400);
      res.end(JSON.stringify({ message: error.message }));
    }
  }
  //   ! Get request
  if (req.url === "/todos" && req.method === "GET") {
    try {
      res.writeHead(200);
      res.end(
        JSON.stringify({
          message: "Todos are here!",
          data: todos,
        })
      );
    } catch (error) {
      res.writeHead(400);
      res.end(JSON.stringify({ message: error.message }));
    }
  }
   //   ! Get request ! todo
  if (req.url === "/todo" && req.method === "GET") {
    try {
        const { id } = await parser(req);
        const finded = todos.find((todo) => todo.id == id);
        if (id &&  finded) {
          res.writeHead(200);
          res.end(JSON.stringify({ message: "Succes" , data : finded }));
        } else {
          throw new Error("BadRequestError");
        }
      } catch (error) {
        res.writeHead(400);
        res.end(JSON.stringify({ message: error.message }));
      }
  }
};

http.createServer(clb).listen(5656);
