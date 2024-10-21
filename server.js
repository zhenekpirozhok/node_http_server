import http from "http";
import { URL, parse } from "url";

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
    const url = new URL(req.url, `http://${req.headers.host}`);
    const params = Object.fromEntries(url.searchParams.entries());

    const pathnameParts = url.pathname.split("/").slice(1);

    if (pathnameParts[0] === "users") {
      switch (req.method) {
        case "GET":
          if (pathnameParts[1]) {
            getUserById(req, res, pathnameParts[1]);
          } else if (params) {
            getUsersByQuery(req, res, params);
          } else {
            getUsers(req, res);
          }
          break;

        case "POST":
          createUser(req, res);
          break;

        case "PUT":
          replaceUser(req, res, pathnameParts[1]);
          break;

        case "PATCH":
          editUser(req, res, pathnameParts[1]);
          break;

        case "DELETE":
          deleteUser(req, res, pathnameParts[1]);
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
  try {
    const user = users.find((user) => user.id === parseInt(userId));
    if (!user) {
      res.writeHead(404);
      return res.end("User not found");
    }

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(user));
  } catch (error) {
    res.writeHead(500);
    res.end(`Internal Server Error: ${error.message}`);
  }
}

function getUsers(req, res) {
  try {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(users));
  } catch (error) {
    res.writeHead(500);
    res.end(`Internal Server Error: ${error.message}`);
  }
}

function createUser(req, res) {
  let newUser = {};
  try {
    req
      .on("data", (user) => {
        newUser = JSON.parse(user);
      })
      .on("end", () => {
        users.push(newUser);
        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(JSON.stringify(newUser));
      });
  } catch (error) {
    res.writeHead(500);
    res.end(`Internal Server Error: ${error.message}`);
  }
}

function replaceUser(req, res, userId) {
  try {
    const userIndex = userId - 1;
    if (!users[userIndex]) {
      res.writeHead(404);
      return res.end("User not found");
    }
    let newUser = {};
    req
      .on("data", (user) => {
        newUser = JSON.parse(user);
      })
      .on("end", () => {
        users[userIndex] = newUser;
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(newUser));
      });
  } catch (error) {
    res.writeHead(500);
    res.end(`Internal Server Error: ${error.message}`);
  }
}

function editUser(req, res, userId) {
  try {
    const userIndex = userId - 1;
    if (!users[userIndex]) {
      res.writeHead(404);
      return res.end("User not found");
    }
    let newUser = {};
    const user = users[userIndex];
    req
      .on("data", (userData) => {
        newUser = JSON.parse(userData);
      })
      .on("end", () => {
        for (let key in newUser) {
          if (newUser[key] !== user[key]) {
            user[key] = newUser[key];
          }
        }
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(user)); // Обновленный объект юзера
      });
  } catch (error) {
    res.writeHead(500);
    res.end(`Internal Server Error: ${error.message}`);
  }
}

function deleteUser(req, res, userId) {
  try {
    const userIndex = userId - 1;
    if (!users[userIndex]) {
      res.writeHead(404);
      return res.end("User not found");
    }
    users.splice(userIndex, 1);
    res.writeHead(204);
    res.end("User deleted");
  } catch (error) {
    res.writeHead(500);
    res.end(`Internal Server Error: ${error.message}`);
  }
}

function getUsersByQuery(req, res, query) {
  try {
    const usersByQuery = users.filter((user) => {
      if (query.name && user.name !== query.name) {
        return false;
      }
      if ((query.age && user.age > query.maxAge) || user.age < query.minAge) {
        return false;
      }
      return true;
    });

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(usersByQuery));
  } catch (error) {
    res.writeHead(500);
    res.end(`Internal Server Error: ${error.message}`);
  }
}
