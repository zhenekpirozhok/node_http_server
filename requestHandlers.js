import userRepoClass from "./userRepo.js";
import { bodyParser } from "./utils.js";

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
  try {
    const body = bodyParser(req);
    const newUser = JSON.parse(body);
    userRepo.create(newUser);
    res.writeHead(201, { "Content-Type": "application/json" });
    res.end(JSON.stringify(newUser));
  } catch (error) {
    res.writeHead(500);
    res.end(`Internal Server Error: ${error.message}`);
  }
}

export async function replaceUser(req, res, userId) {
  try {
    const body = await bodyParser(req);
    const user = JSON.parse(body);
    await userRepo.update(+userId, user);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(user));
  } catch (error) {
    res.writeHead(500);
    res.end(`Internal Server Error: ${error.message}`);
  }
}

export async function editUser(req, res, userId) {
  try {
    const user = await userRepo.getById(+userId);
    const body = await bodyParser(req);
    const updatedUser = JSON.parse(body);

    for (const key in updatedUser) {
      if (user[key] !== updatedUser[key]) {
        user[key] = updatedUser[key];
      }
    }
    await userRepo.update(+userId, user);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(user));
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
