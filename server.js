import http from "http";
import { parse } from "node:url";

const users = [
  {
    id: 1,
    name: "Yauheniya",
    age: 20,
  },
  {
    id: 2,
    name: "Elena",
    age: 28,
  },
  {
    id: 3,
    name: "Oleg",
    age: 32,
  },
];

http
  .createServer((req, res) => {
    const { pathname, search } = parse(req.url, true);
    const pathnameParts = pathname.split("/").slice(1);

    if (pathnameParts[0] === "users") {
      switch (req.method) {
        case "GET":
          if (pathnameParts[1]) {
            getUserById(req, res, pathnameParts[1]);
          } else {
            getUsers(req, res);
          }
          break;

        case "POST":
          createUser(req, res);
          break;

        case "PUT":
          break;

        case "DELETE":
          break;

        default:
          res.writeHead(404);
          res.end();
      }
    }
  })
  .listen(8080, () => {
    console.log("Server running at http://127.0.0.1:8080/");
  });

function getUserById(req, res, userId) {
  const user = users.find((user) => user.id === parseInt(userId));
  if (!user) {
    res.writeHead(404);
    res.end("User not found");
  }

  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(user));
}

function getUsers(req, res) {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(users));
}

function createUser(req, res) {
  let newUser = {};
  req
    .on("data", (user) => {
      newUser = JSON.parse(user);
    })
    .on("end", () => {
      users.push(newUser);
      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify(newUser));
    });
}
