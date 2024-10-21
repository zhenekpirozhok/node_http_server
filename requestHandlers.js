import userRepoClass from "./userRepo.js";

const userRepo = new userRepoClass();

export async function getUserById(req, res, userId) {
  try {
    const user = await userRepo.getById(+userId);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(user));
  } catch (error) {
    res.writeHead(500);
    res.end(error.message);
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
      .on("end", async () => {
        await userRepo.create(newUser);
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
          userRepo.update(+userId, newUser);
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
    const user = userRepo.getById(+userId);
    let newUser = {};
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
    userRepo.delete(+userId);
    res.writeHead(200);
    res.end("User deleted");
  } catch (error) {
    res.writeHead(500);
    res.end(`Internal Server Error: ${error.message}`);
  }
}

function filterByQuery(query) {
  return (user) => {
    if (query.name && user.name !== query.name) {
      return false;
    }
    if ((query.age && user.age > query.maxAge) || user.age < query.minAge) {
      return false;
    }
    return true;
  };
}

export async function getUsersByQuery(req, res, query) {
  try {
    const usersByQuery = await userRepo.filterUsers(filterByQuery(query));

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(usersByQuery));
  } catch (error) {
    res.writeHead(500);
    res.end(`Internal Server Error: ${error.message}`);
  }
}
