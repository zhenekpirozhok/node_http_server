import http from "http";
import { URL } from "url";
import {
  createUser,
  deleteUser,
  editUser,
  getUsers,
  getUsersByQuery,
  getUserById,
  replaceUser,
} from "./requestHandlers.js";

http
  .createServer(async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const params = Object.fromEntries(url.searchParams.entries());

    const pathnameParts = url.pathname.split("/").slice(1);

    if (pathnameParts[0] === "users") {
      switch (req.method) {
        case "GET":
          if (pathnameParts[1]) {
            await getUserById(req, res, pathnameParts[1]);
          } else if (url.search) {
            await getUsersByQuery(req, res, params);
          } else {
            await getUsers(req, res);
          }
          break;

        case "POST":
          await createUser(req, res);
          break;

        case "PUT":
          await replaceUser(req, res, pathnameParts[1]);
          break;

        case "PATCH":
          await editUser(req, res, pathnameParts[1]);
          break;

        case "DELETE":
          await deleteUser(req, res, pathnameParts[1]);
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
