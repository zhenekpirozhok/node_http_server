import { promises as fs } from "fs";
import path from "path";

const filePath = path.resolve("./data.json");

class UserRepository {
  async getAll() {
    try {
      const data = await fs.readFile(filePath, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      throw new Error("Error reading users file");
    }
  }

  async getById(id) {
    try {
      const users = await this.getAll();
      const user = users.find((user) => user.id === id);
      if (!user) {
        throw new Error(`User with ID ${id} not found`);
      }
      return user;
    } catch (error) {
      throw new Error(`Error getting user by ID: ${error.message}`);
    }
  }

  async filterUsers(filterFunction) {
    try {
      const users = await this.getAll();
      return users.filter(filterFunction);
    } catch (error) {
      throw new Error("Error filtering users");
    }
  }

  async create(user) {
    try {
      const users = await this.getAll();
      user.id = users.length ? users[users.length - 1].id + 1 : 1;
      users.push(user);
      await this._saveToFile(users);
      return user;
    } catch (error) {
      throw new Error("Error creating user");
    }
  }

  async update(id, updatedUser) {
    try {
      const users = await this.getAll();
      const index = users.findIndex((user) => user.id === id);
      if (index === -1) {
        throw new Error(`User with ID ${id} not found`);
      }

      users[index] = { ...users[index], ...updatedUser };
      await this._saveToFile(users);
      return users[index];
    } catch (error) {
      throw new Error(`Error updating user: ${error.message}`);
    }
  }

  async delete(id) {
    try {
      const users = await this.getAll();
      const newUsers = users.filter((user) => user.id !== id);
      if (newUsers.length === users.length) {
        throw new Error(`User with ID ${id} not found`);
      }
      await this._saveToFile(newUsers);
    } catch (error) {
      throw new Error(`Error deleting user: ${error.message}`);
    }
  }

  async _saveToFile(users) {
    try {
      await fs.writeFile(filePath, JSON.stringify(users, null, 2), "utf-8");
    } catch (error) {
      throw new Error("Error saving to file");
    }
  }
}

export default UserRepository;
