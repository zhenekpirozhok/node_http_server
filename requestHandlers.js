import userRepoClass from "./userRepo.js";

const userRepo = new userRepoClass();

export async function getUserById(req, res, userId) {
  try {
    const user = awaituserRepo.getById(userId);
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

export async function getUsers(req, res) {
  try {
    const users = await userRepo.getAll();
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(users));
  } catch (error) {
    res.writeHead(500);
    res.end(`Internal Server Error: ${error.message}`);
  }
}

export function createUser(req, res) {
  let newUser = {};
  try {
    req
      .on("data", (user) => {
        newUser = JSON.parse(user);
      })
      .on("end", () => {
        userRepo.create(newUser);
        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(JSON.stringify(newUser));
      });
  } catch (error) {
    res.writeHead(500);
    res.end(`Internal Server Error: ${error.message}`);
  }
}

export function replaceUser(req, res, userId) {
  try {
    let newUser = {};
    req
      .on("data", (user) => {
        newUser = JSON.parse(user);
      })
      .on("end", () => {
        try {
          userRepo.update(userId, newUser);
        } catch (error) {
          res.writeHead(404);
          res.end(`Internal Server Error: ${error.message}`);
        }
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(newUser));
      });
  } catch (error) {
    res.writeHead(500);
    res.end(`Internal Server Error: ${error.message}`);
  }
}

export function editUser(req, res, userId) {
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

export function deleteUser(req, res, userId) {
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

export function getUsersByQuery(req, res, query) {
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
