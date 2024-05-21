const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sqlite3 = require("sqlite3").verbose();
var cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors())
// Database setup
const db = new sqlite3.Database("database.db");
db.serialize(() => {
  db.run(
    "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, email TEXT UNIQUE, password TEXT, name TEXT, surname TEXT, gender TEXT, birth TEXT, country TEXT)"
  );
});

const pb = new sqlite3.Database("publications.db");
pb.serialize(() => {
  pb.run(
    "CREATE TABLE IF NOT EXISTS pubs (id INTEGER PRIMARY KEY, author TEXT, publication TEXT, collection TEXT, field TEXT)"
  );
});


// Routes
app.post("/register", (req, res) => {
  const { email, password, name_, surname, gender, birth, country} = req.body;
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  db.run(
    "INSERT INTO users (email, password, name, surname, gender, birth, country) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [email, hashedPassword, name_, surname, gender, birth, country],
    (err) => {
      if (err) {
        res.status(500).json({ message: "An error occurred" });
      } else {
        res.status(201).json({ message: "User created" });
      }
    }
  );
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.get("SELECT * FROM users WHERE email = ?", [email], (err, row) => {
    if (err) {
      res.status(500).json({ message: "An error occurred" });
    } else if (!row) {
      res.status(401).json({ message: "Email or password is incorrect" });
    } else {
      const passwordIsValid = bcrypt.compareSync(password, row.password);

      if (!passwordIsValid) {
        res.status(401).json({ message: "Email or password is incorrect" });
      } else {
        const token = jwt.sign({ id: row.id }, "secret", {
          expiresIn: 86400, // Expires in 24 hours
        });

        res.status(200).json({ auth: true, token: token, name_: row.name, surname: row.surname, gender: row.gender, birth: row.birth, country: row.country });
      }
    }
  });
});

app.get("/profile", (req, res) => {
  const token = req.headers["x-access-token"];
  
  if (!token) {
    return res.status(401).json({ auth: false, message: "No token provided" });
  }

  jwt.verify(token, "secret", (err, decoded) => {
    if (err) {
      return res.status(500).json({ auth: false, message: "Failed to authenticate token" });
    }

    db.get("SELECT * FROM users WHERE id = ?", [decoded.id], (err, row) => {
      if (err) {
        res.status(500).json({ message: "An error occurred" });
      } else if (!row) {
        res.status(404).json({ message: "User not found" });
      } else {
        res.status(200).json({ id: row.id, email: row.email, name_:row.name });
      }
    });
  });
});

app.put("/profile", (req, res) => {
  const token = req.headers["x-access-token"];

  if (!token) {
    return res.status(401).json({ auth: false, message: "No token provided" });
  }

  jwt.verify(token, "secret", (err, decoded) => {
    if (err) {
      return res.status(500).json({ auth: false, message: "Failed to authenticate token" });
    }

    const { name_, surname, gender, birth, country, email } = req.body;

    db.run(
      "UPDATE users SET name = ?, surname = ?, gender = ?, birth = ?, country = ?, email = ? WHERE id = ?",
      [name_, surname, gender, birth, country, email, decoded.id],
      function (err) {
        if (err) {
          res.status(500).json({ message: "An error occurred" });
        } else if (this.changes === 0) {
          res.status(404).json({ message: "User not found" });
        } else {
          db.get("SELECT * FROM users WHERE id = ?", [decoded.id], (err, row) => {
            if (err) {
              res.status(500).json({ message: "An error occurred" });
            } else if (!row) {
              res.status(404).json({ message: "User not found" });
            } else {
              res.status(200).json({
                id: row.id,
                email: row.email,
                name_: row.name,
                surname: row.surname,
                gender: row.gender,
                birth: row.birth,
                country: row.country,
              });
            }
          });
        }
      }
    );
  });
});

app.post("/publications/add", (req, res) => {
  const { author, publication, collection, field } = req.body;
  pb.run(
    "INSERT INTO pubs (author, publication, collection, field) VALUES (?, ?, ?, ?)",
    [author, publication, collection, field],
    function (err) {
      if (err) {
        res.status(500).json({ message: "An error occurred" });
      } else {
        res.status(201).json({ id: this.lastID, author, publication, collection, field });
      }
    }
  );
});

app.get("/publications", (req, res) => {
  pb.all("SELECT * FROM pubs", [], (err, rows) => {
    if (err) {
      res.status(500).json({ message: "An error occurred" });
    } else {
      res.status(200).json(rows);
    }
  });
});

app.delete("/publications/:id", (req, res) => {
  const { id } = req.params;
  pb.run("DELETE FROM pubs WHERE id = ?", [id], function (err) {
    if (err) {
      res.status(500).json({ message: "An error occurred" });
    } else if (this.changes === 0) {
      res.status(404).json({ message: "Publication not found" });
    } else {
      res.status(200).json({ message: "Publication deleted" });
    }
  });
});

app.get("/publications/search", (req, res) => {
  const { query } = req.query;
  const sql = `
    SELECT * FROM pubs 
    WHERE author LIKE ? OR publication LIKE ? OR collection LIKE ? OR field LIKE ?
  `;
  const params = [`%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`];
  pb.all(sql, params, (err, rows) => {
    if (err) {
      res.status(500).json({ message: "An error occurred" });
    } else {
      res.status(200).json(rows);
    }
  });
});

app.get("/publications/filter", (req, res) => {
  const { author, publication, collection, field } = req.query;

  // Construct SQL query based on filters
  let sqlQuery = "SELECT * FROM pubs WHERE 1 = 1";
  const params = [];

  if (author) {
    sqlQuery += " AND author = ?";
    params.push(author);
  }
  if (publication) {
    sqlQuery += " AND publication = ?";
    params.push(publication);
  }
  if (collection) {
    sqlQuery += " AND collection = ?";
    params.push(collection);
  }
  if (field) {
    sqlQuery += " AND field = ?";
    params.push(field);
  }

  pb.all(sqlQuery, params, (err, rows) => {
    if (err) {
      res.status(500).json({ message: "An error occurred while fetching publications" });
    } else {
      res.status(200).json(rows);
    }
  });
});

app.put("/publications/edit/:id", (req, res) => {
  const { id } = req.params;
  const { author, publication, collection, field } = req.body;
  pb.run(
    "UPDATE pubs SET author = ?, publication = ?, collection = ?, field = ? WHERE id = ?",
    [author, publication, collection, field, id],
    function (err) {
      if (err) {
        res.status(500).json({ message: "An error occurred" });
      } else {
        res.status(200).json({ id, author, publication, collection, field });
      }
    }
  );
});

app.get("/publications/:id", (req, res) => {
  const publicationId = req.params.id;
  
  // Здійснюємо запит до бази даних або будь-якого іншого джерела даних, щоб отримати дані публікації за її id
  // Наприклад, якщо ви використовуєте базу даних SQLite з бібліотекою sqlite3:
  pb.get("SELECT * FROM pubs WHERE id = ?", [publicationId], (err, row) => {
    if (err) {
      console.error("Error fetching publication:", err);
      res.status(500).json({ message: "An error occurred while fetching publication" });
    } else {
      if (row) {
        // Якщо публікація знайдена, повертаємо її дані
        res.json(row);
      } else {
        // Якщо публікація з вказаним id не знайдена
        res.status(404).json({ message: "Publication not found" });
      }
    }
  });
});



// Start server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
