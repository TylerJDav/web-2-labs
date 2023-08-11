// @ts-check

const Pool = require("pg").Pool;
const express = require("express");
const path = require("path");
const app = express();
const port = 8080;

const dbClient = new Pool({
  password: "root",
  user: "root",
  host: "postgres",
});

app.use(express.json());

app
  .route("/employees")
  .get(async (req, res) => {
    console.log("server.js.getall");
    console.log(req);
    const results = await dbClient
      .query("SELECT * FROM employees WHERE title != 'inactive'")
      .then((payload) => {
        return payload.rows;
      })
      .catch(() => {
        throw new Error("Query failed");
      });
    res.setHeader("Content-Type", "application/json");
    res.status(200);
    res.send(JSON.stringify(results));
  })
  .post(async (req, res) => {
    console.log("server.js.post");
    const { name, title, avatar } = req.body;
    try {
      await dbClient.query(
        "INSERT INTO employees(name, title, avatar) VALUES ($1, $2, $3)",
        [name, title, avatar]
      );
      res.status(200).json({ message: "Employee added successfully." });
    } catch (error) {
      console.log(error);
    }
  });

app.route("/employees/:idOrName").get(async (req, res) => {
  const { idOrName } = req.params;

  if (/^\d+$/.test(idOrName)) {
    const id = parseInt(idOrName);
    const results = await dbClient
      .query("SELECT * FROM employees WHERE title != 'inactive' AND id = $1", [
        id,
      ])
      .then((payload) => {
        return payload.rows;
      })
      .catch(() => {
        throw new Error("Query failed");
      });
    res.setHeader("Content-Type", "application/json");
    res.status(200);
    res.send(JSON.stringify(results));
  } else {
    const results = await dbClient
      .query(
        "SELECT * FROM employees WHERE title != 'inactive' AND name ILIKE '%' || $1 || '%'",
        [idOrName]
      )
      .then((payload) => {
        return payload.rows;
      })
      .catch(() => {
        throw new Error("Query failed");
      });
    res.setHeader("Content-Type", "application/json");
    res.status(200);
    res.send(JSON.stringify(results));
  }
});

app
  .route("/employees/:id")

  .put(async (req, res) => {
    console.log(req);
    const { id } = req.params;
    const { name, title, avatar } = req.body;
    console.log(name, title, avatar);
    try {
      await dbClient.query(
        "UPDATE employees SET name=$2, title=$3, avatar=$4 WHERE id=$1;",
        [id, name, title, avatar]
      );
      res.status(200).json({ message: "Employee updated successfully." });
    } catch (error) {
      console.log(error);
    }
  })
  .delete(async (req, res) => {
    console.log("server.js.delete");
    const { id } = req.params;
    try {
      await dbClient.query("DELETE FROM employees WHERE id=$1;", [id]);
      res.status(200).json({ message: "Employee deleted successfully." });
    } catch (error) {
      throw new Error("Query failed");
    }
  });

app.use(express.static("client/build"));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
});

(async () => {
  await dbClient.connect();

  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
})();
