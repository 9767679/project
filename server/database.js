const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./campus_notes.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS courses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      professor TEXT NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      course_id INTEGER,
      title TEXT NOT NULL,
      semester TEXT NOT NULL,
      type TEXT NOT NULL,
      link TEXT NOT NULL,
      contributor TEXT,
      FOREIGN KEY (course_id) REFERENCES courses(id)
    )
  `);

  db.get("SELECT count(*) as count FROM courses", (err, row) => {
    if (row && row.count === 0) {
      db.run("INSERT INTO courses (name, professor) VALUES ('網頁程式設計', '張教授')");
      db.run("INSERT INTO courses (name, professor) VALUES ('微積分(一)', '李微積')");
      
      db.run("INSERT INTO notes (course_id, title, semester, type, link, contributor) VALUES (1, '114學年度期末網頁專題範例', '114-2', '課堂筆記', 'https://drive.google.com', '熱心學長')");
      db.run("INSERT INTO notes (course_id, title, semester, type, link, contributor) VALUES (2, '113微積分期中考考古題解答', '113-1', '考古題', 'https://drive.google.com', '不具名學姊')");
      console.log('🎉 SQLite 測試資料初始化成功！');
    }
  });
});

module.exports = db;
