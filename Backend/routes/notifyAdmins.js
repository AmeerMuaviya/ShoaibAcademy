import express from "express";
const router = express.Router();
import { db } from "../db.js";
import { adminOnly, adminOrTeacher, authenticatedOnly } from "./authRoutes.js";
router.use(authenticatedOnly)
//send notification to admin
router.post('/add',adminOrTeacher,(req,res)=>{

    db.query('INSERT INTO notifyAdmin SET ?',[req.body],(err,data)=>{
        if(err) res.status(200).json({err:true,msg:err.sqlMessage})
        else res.status(200).json({err:false,msg:'Notified admin successfully :)'})
    })
})

router.get('/get/all',adminOnly,(req,res)=>{
    db.query('SELECT * FROM notifyAdmin ORDER BY id DESC',(err,data)=>{
        if(err) res.status(200).json({err:true,msg:err.sqlMessage})
        else res.status(200).json({err:false,notifications:data})
    })
})
router.get('/get-unseen',adminOnly,(req,res)=>{
    db.query('SELECT * FROM notifyAdmin WHERE status=?',['Unseen'],(err,data)=>{
        if(err) res.status(200).json({err:true,msg:err.sqlMessage})
        else res.status(200).json({err:false,count:data.length})
    })
})
router.post('/mark/all',adminOnly,(req,res)=>{
    db.query('UPDATE notifyAdmin SET status=?',['Seen'],(err,data)=>{
        if(err) res.status(200).json({err:true,msg:err.sqlMessage})
        else res.status(200).json({err:false,msg:'success'})
    })
})
router.get('/getInfo',adminOnly,(req,res)=>{
    db.query('SELECT * FROM notifyAdmin',(err,data)=>{
        if(err) res.status(200).json({err:true,msg:err.sqlMessage})
       let totalNotifications=data.length
       let unseeNotifications=data.filter((value) => value.status==='Unseen').length
       res.status(200).json(((unseeNotifications/totalNotifications)*100).toFixed(1))
    })
})


export default router