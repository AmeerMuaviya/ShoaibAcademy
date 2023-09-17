import express from "express";
import {db} from '../db.js'
const router = express.Router()

router.post('/add-blog',(req,res)=>{
    db.query('INSERT INTO blogs set ?',[req.body],(err,data)=>{
        if(err) res.json({err:true,msg:err.sqlMessage})
        else res.json({err:false,msg:'Blog added successfully :)'})
    })
})
router.get('/all',(req,res)=>{
    db.query('SELECT * FROM blogs',(err,blogs)=>{
        if(err) res.json({err:true,msg:err.sqlMessage})
        else res.json({blogs})
    })
})
router.delete('/delete-blog/:id',(req,res)=>{
    db.query('DELETE FROM blogs WHERE id=?',[req.params.id],(err,blogs)=>{
        if(err) res.json({err:true,msg:err.sqlMessage})
        else res.json({msg:'Blog removed successfully :)'})
    })
})

export default router