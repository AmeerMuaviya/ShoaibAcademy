import mysql from "mysql";

export const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database:'Shoaib Academy'
  
});

// import mysql from "mysql";

// export const db = mysql.createConnection({
//   host: "localhost",
//   user: "techrayz_techrayz",
//   password: "afqy+Vz9Rgor",
//   database:'techrayz_shoaibacademy'
  
// });

