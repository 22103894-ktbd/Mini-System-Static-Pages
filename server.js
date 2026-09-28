const express = require("express");
const mysql = require("mysql2");
const app = express();
const PORT = 3000;
app.use(express.json());
app.use(express.static(__dirname));

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "student_db",
});
db.connect((err) =>{
  if(err){
    console.error("Database connection failed:", err.message);
    return;
  }
  console.log("Connected to MySQL database.");
});
// GET /api/students -> all students
app.get("/api/students", (req, res) =>{
  db.query("SELECT * FROM students ORDER BY id", (err, results) =>{
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to fetch students." });
    }
    res.json(results);
  });
});
// GET /api/students/:id -> one student
app.get("/api/students/:id", (req, res) =>{
  db.query("SELECT * FROM students WHERE id = ?", [req.params.id], (err, results) =>{
    if(err){
      console.error(err);
      return res.status(500).json({ error: "Failed to fetch student." });
    }
    if(results.length === 0){
      return res.status(404).json({ error: `No student found with ID ${req.params.id}` });
    }
    res.json(results[0]);
  });
});
// POST /api/students -> add a student
app.post("/api/students", (req, res) =>{
  const{ id, name, program, year, email, status } = req.body;
  if(!id || !name || !program || !year || !email || !status){
    return res.status(400).json({ error: "All fields are required." });
  }
  const sql = "INSERT INTO students (id, name, program, year, email, status) VALUES (?, ?, ?, ?, ?, ?)";
  db.query(sql,[id, name, program, year, email, status], (err) =>{
    if(err){
      if(err.code === "ER_DUP_ENTRY"){
        return res.status(409).json({ error: `Student ID ${id} already exists.` });
      }
      console.error(err);
      return res.status(500).json({ error: "Failed to add student." });
    }
    res.status(201).json({ id, name, program, year, email, status });
  });
});
// PUT /api/students/:id -> update a student
app.put("/api/students/:id", (req, res) =>{
  const { name, program, year, email, status } = req.body;
  const sql = "UPDATE students SET name = ?, program = ?, year = ?, email = ?, status = ? WHERE id = ?";
  db.query(sql, [name, program, year, email, status, req.params.id], (err, result) =>{
    if(err){
      console.error(err);
      return res.status(500).json({ error: "Failed to update student." });
    }
    if(result.affectedRows === 0){
      return res.status(404).json({ error: `No student found with ID ${req.params.id}` });
    }
    res.json({ id: req.params.id, name, program, year, email, status });
  });
});
//DELETE-> /api/students/:id->delete a student
app.delete("/api/students/:id", (req, res) =>{
  db.query("DELETE FROM students WHERE id = ?", [req.params.id], (err, result) =>{
    if(err){
      console.error(err);
      return res.status(500).json({ error: "Failed to delete student." });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: `No student found with ID ${req.params.id}` });
    }
    res.json({ deleted: true, id: req.params.id });
  });
});

app.listen(PORT, () =>{
  console.log(`Server running at http://localhost:${PORT}`);
});