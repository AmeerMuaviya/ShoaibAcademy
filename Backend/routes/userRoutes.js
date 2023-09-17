import express from "express";
import { db } from "../db.js";
import jwt from "jsonwebtoken";
import { authenticatedOnly } from "./authRoutes.js";
const router = express.Router()

//get a user with just id
router.use(authenticatedOnly)
router.get('/getUser/:uid',(req,res)=>{
    let cookie = req.cookies
    if (cookie.Token) {
    let verify_token = jwt.verify(cookie.Token, process.env.SECRET_KEY)
    if(verify_token.uid!==req.params.uid && verify_token.status!=='Admin') return res.status(403).send(`<h1>Failed to load resource: the server responded with a status of 403 (Forbidden)</h1>`)
  }
    db.query('SELECT * FROM Users WHERE uid=?',[req.params.uid],(err,data)=>{
        if(err) res.send({err:true,msg:err.sqlMessage})
        else if(data.length)
        db.query(`SELECT * FROM ${data[0].status}s WHERE uid=?`,[req.params.uid],(err,data)=>{
            if(err) res.send({err:true,msg:err.sqlMessage})
            else if(data.length) res.send ({err:false,user:data[0]})
        })
    })  
})



export default router