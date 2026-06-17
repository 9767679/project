const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/api/courses', (req, res) => {
  db.all("SELECT * FROM courses", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/courses', (req, res) => {
  const { name, professor } = req.body;
  db.run("INSERT INTO courses (name, professor) VALUES (?, ?)", [name, professor], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, name, professor });
  });
});

app.get('/api/notes', (req, res) => {
  const { course_id } = req.query;
  let sql = "SELECT notes.*, courses.name as course_name FROM notes JOIN courses ON notes.course_id = courses.id";
  let params = [];

  if (course_id) {
    sql += " WHERE notes.course_id = ?";
    params.push(course_id);
  }

  db.all(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/notes', (req, res) => {
  const { course_id, title, semester, type, link, contributor } = req.body;
  const sql = "INSERT INTO notes (course_id, title, semester, type, link, contributor) VALUES (?, ?, ?, ?, ?, ?)";
  
  db.run(sql, [course_id, title, semester, type, link, contributor || '匿名學長姐'], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, msg: "分享成功！" });
  });
});

app.listen(PORT, () => {
  console.log(`🚀 後端伺服器已成功啟動：http://localhost:${PORT}`);
});
