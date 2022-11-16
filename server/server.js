// import
require("dotenv").config();
const express = require("express");
const app = express();

const mysql = require("mysql");
const cors = require("cors");
const fs = require("fs");

// db
const db = mysql.createConnection({
  host: process.env.DB_URL,
  // port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

db.connect((err) => {
  if (!err) {
    console.log("Mysql DB Success");
  } else {
    console.log(err);
  }
});

// middle ware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

// url
app.get("/boardlist", (req, res) => {
  const sql = "select * from board_edit order by board_idx desc;";
  db.query(sql, (err, result) => {
    if(err) throw err;
    res.send(result);
  })
})

app.post("/boardAdd", (req, res) => {
  const {board_name ,board_type, board_url, secret, read_allow, write_allow, reply_allow, modify_allow, delete_allow, upload, download, board_desc} = req.body;
  let sql = "INSERT INTO board_edit VALUES(NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,now());";
  db.query(sql, [board_name ,board_type, board_url, secret, read_allow, write_allow, reply_allow, modify_allow, delete_allow, upload, download, board_desc], (err) => {
    if(err){
      throw err;
    }else{
      res.send({status:201, message:"게시판 생성 완료"});
      let createSQL = "CREATE TABLE board_"+board_name+"(";
          createSQL += "idx int auto_increment primary key,";
          createSQL += "board_idx int,";
          createSQL += "title varchar(50),";
          createSQL += "writer varchar(20),";
          createSQL += "passwd varchar(20),";
          createSQL += "contents text,";
          createSQL += "image varchar(255),";
          createSQL += "count int default 0,";
          createSQL += "regdate datetime,";
          createSQL += "foreign key (board_idx) references board_edit(board_idx)";
          createSQL += ");";
      db.query(createSQL, (err) => {
        if(err){
          throw err;
        }else{
          console.log("board_"+board_name+" Create Completed.");
        }
      })
    }
  })
})

app.get("/board", (req, res) => {
  console.log(req.query);
  let sql = "select * from board_"+req.query.boardName+" order by idx desc;";
  db.query(sql, (err, result) => {
    if(err){
      throw err;
    }else{
      console.log(result);
      res.send(result);
    }
  })
})

app.post("/write", (req, res) => {
  const { board_name, board_idx, title, writer, passwd, contents, image, count } = req.body;
  let sql = "insert into board_"+board_name+"values(null, ?, ?, ?, ?, ?, ?, ?, now();";
  db.query(sql, [board_idx, title, writer, passwd, contents, image, count], (err) => {
    if(err){
      throw err;
    }else{
      console.log("write complete");
      res.redirect("/board?board_name="+board_name);
    }
  })
})

app.listen(process.env.PORT, () => console.log("Server Running Port : " + process.env.PORT));