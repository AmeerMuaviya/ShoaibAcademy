import express from "express";
const router = express.Router();
import { db } from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

router.post("/login/:userType", (req, res) => {
  // res.header("Access-Control-Allow-Credentials", "true");
  db.query(
    `SELECT * FROM Users WHERE username = ? and isActive=1 and status = ?`,
    [req.body.username, req.params.userType],
    (err, data) => {
      if (err) res.json(err);
      else if (!data.length) res.json({ err: true, msg: "User Not found" });
      else {
        // '$2a$10$YsD8eNSoIB1i3bOw4P0heescuJZyjOo7OuPZ6jSoZJVyyjF2l2KxO',
        const Password = bcrypt.compareSync(
          req.body.password,
          data[0].password
        );
        if (!Password)
          return res.json({ err: true, msg: "Invalid Username or Password" });
        const { id, status, uid } = data[0];
        const token = jwt.sign({ id, status, uid }, process.env.SECRET_KEY, {
          expiresIn: "168h",
        });
        db.query(`SELECT * FROM ${status}s WHERE uid=?`, uid, (err, _data) => {
          let oneWeek = 6.048e8;
          res
            .cookie("Token", token, { maxAge: oneWeek, httpOnly: true })
            .status(200)
            .json({ err: false, user: _data[0] });
        });
      }
    }
  );
});

router.post("/logout", (req, res) => {
  res.clearCookie("Token").json("User Logged Out");
});

router.post("/verifyuser", (req, res) => {
  let cookie = req.cookies;
  try {
    if (cookie.Token) {
      jwt.verify(cookie.Token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) return res.clearCookie("Token").json(null);
        db.query(
          `SELECT * FROM Users WHERE uid=? and isActive=1`,
          [decoded.uid],
          (err, data) => {
            if (err) return res.clearCookie("Token").json(null);
            else if (data.length) {
              db.query(
                `SELECT * FROM ${data[0].status}s WHERE uid=?`,
                data[0].uid,
                (err, _data) => {
                  if (_data.length) return res.status(200).json(_data[0]);
                }
              );
            } else res.status(200).json(null);
          }
        );
      });
    } else res.status(200).json(null);
  } catch (error) {
    res
      .status(200)
      .json({
        err: true,
        msg: "There is some problem while logging into your account",
      });
  }
});
//already checking that this account blongs to him
router.post("/changePassword", (req, res) => {
  let cookie = req.cookies;
  if (cookie.Token) {
    let verify_token = jwt.verify(cookie.Token, process.env.SECRET_KEY);
    if (verify_token.uid !== req.body.uid)
      return res
        .status(403)
        .json("It seems that this account doesn't belongs to you :(");
    db.query(
      `SELECT * FROM Users WHERE uid=?`,
      [verify_token.uid],
      (err, data) => {
        if (err)
          return res.status(200).json({ err: true, msg: err.sqlMessage });
        const Password = bcrypt.compareSync(
          req.body.prevPass,
          data[0].password
        );
        if (!Password) return res.json({ err: true, msg: "Invalid Password" });
        let salt = bcrypt.genSaltSync(10);
        let newPassword = bcrypt.hashSync(req.body.newPass, salt);
        db.query(
          "UPDATE Users SET ? WHERE uid=?",
          [{ password: newPassword }, verify_token.uid],
          (err, data) => {
            if (err) res.json({ err: true, msg: err.sqlMessage });
            else
              res.json({ err: false, msg: "Password Changed Successfully :)" });
          }
        );
      }
    );
  } else res.status(404).json(null);
});

export function adminOnly(req, res, next) {
  let cookie = req.cookies;
  if (!cookie.Token) return res.status(401).json("Authentiation Error");
  let verify_token = jwt.verify(cookie.Token, process.env.SECRET_KEY);
  if (verify_token && verify_token.status === "Admin") {
    next();
  }
}
export function adminOrTeacher(req, res, next) {
  let cookie = req.cookies;
  if (cookie.Token) {
    let verify_token = jwt.verify(cookie.Token, process.env.SECRET_KEY);
    if (
      (verify_token && verify_token.status === "Admin") ||
      verify_token.status === "Teacher"
    )
      next();
    else res.status(401).json("Authentiation Error");
  }
}

export function authenticatedOnly(req, res, next) {
  let cookie = req.cookies;
  if (cookie.Token) {
    let verify_token = jwt.verify(cookie.Token, process.env.SECRET_KEY)
    db.query(`SELECT * FROM Users WHERE uid=? and isActive=1`, [verify_token.uid], (err, data) => {
      if (err || !data.length) return res.status(404).json(err)
  next();
    })
  }
  else res.status(401).json(null)
}

export default router;
