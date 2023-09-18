import bcrypt from "bcryptjs";
import { db } from "../db.js";
function pad(number, length) {
  var str = "" + number;
  while (str.length < length) {
    str = "0" + str;
  }

  return str;
}

export const provideUniqueId = (tname, status) => {
  return (req, res, next) => {
    db.query(`SELECT * FROM ${tname} ORDER BY ID DESC LIMIT 1`, (err, data) => {
      let id = pad(1, 3);
      if (err) return res.status(200).json({ err: true, msg: err.toString() });
      else if (data.length) {
        id = pad(parseInt(data[0].uid.split("-")[1]) + 1, 3);
      }
      req.uid =
        status.substring(0, 2).toUpperCase() +
        new Date().getFullYear().toString().slice(-2) +
        "-" +
        id;
      next();
    });
  };
};
export let addUsersInUsersTable = (tableName) => {
  return (req, res, next) => {
    next();
    let salt = bcrypt.genSaltSync(10);
    const password = bcrypt.hashSync(req.body.password, salt);
    if (!req.err) {
      let d = {
        username: req.body.username,
        password: password,
        status: req.body.status,
        Uid: req.uid,
      };
      db.query(`INSERT INTO Users set ?`, d);
    }
  };
};
export const deleteFromUsersTable = (req, res, next) => {
  next();
  db.query("DELETE FROM Users WHERE uid=?", req.params.id, (err, dat) => {
    if (err) return res.status(200).json({ err: true, msg: err.sqlMessage });
  });
};
export let updateUsersTable = (req, res, next) => {
  next();
  let salt = bcrypt.genSaltSync(10);
  const password = bcrypt.hashSync(req.body.password, salt);
  let data = { username: req.body.username };
  if (password.length) data["password"] = password;
  db.query(
    `UPDATE Users SET ? WHERE uid=?`,
    [data, req.params.id],
    (err, data) => {}
  );
};
