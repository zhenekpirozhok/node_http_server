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
    const { pathname, search } = parse(req.url, true);
    const pathnameParts = pathname.split("/").slice(1);

    const url = new URL(req.url, `http://${req.headers.host}`);
    const params = Object.fromEntries(url.searchParams.entries());

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

function replaceUser(req, res, userId) {
  if (!users[userId - 1]) {
    res.writeHead(404);
    res.end("User not found");
  }
  let newUser = {};
  req
    .on("data", (user) => {
      newUser = JSON.parse(user);
    })
    .on("end", () => {
      users[userId - 1] = newUser;
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(newUser));
    });
}

// TODO: PATCH not like PUT
function editUser(req, res, userId) {
  if (!users[userId - 1]) {
    res.writeHead(404);
    res.end("User not found");
  }
  let newUser = {};
  const user = users[userId - 1];
  req
    .on("data", (user) => {
      newUser = JSON.parse(user);
    })
    .on("end", () => {
      for (let key in newUser) {
        if (newUser[key] !== user[key]) {
          user[key] = newUser[key];
        }
      }
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(newUser));
    });
}

function deleteUser(req, res, userId) {
  if (!users[userId - 1]) {
    res.writeHead(404);
    res.end("User not found");
  }
  users.splice(userId - 1, 1);
  res.writeHead(204);
  res.end("User deleted");
}

function getUsersByQuery(req, res, query) {
  res.writeHead(200, { "Content-Type": "application/json" });

  const usersByQuery = users.filter((user) => {
    if (query.name && user.name !== query.name) {
      return false;
    }
    if ((query.age && user.age > query.maxAge) || user.age < query.minAge) {
      return false;
    }
    return true;
  });

  res.end(JSON.stringify(usersByQuery));
}
