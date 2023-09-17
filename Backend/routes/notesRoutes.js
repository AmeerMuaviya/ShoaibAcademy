import express from "express";
const router = express.Router();
import { db } from "../db.js";
import { adminOrTeacher, authenticatedOnly } from "./authRoutes.js";

router.use(authenticatedOnly)

router.post('/add',adminOrTeacher,(req,res)=>{
    db.query('INSERT INTO notes SET ?',[req.body],(err,data)=>{
        if(err) res.status(200).json({err:true,msg:err.sqlMessage})
        if(data) res.status(200).json({err:false,msg:'Notes added successfully :)'})
        
    })
})
//only authenticated (default)
router.get('/all',(req,res)=>{
    db.query('SELECT * FROM notes ORDER BY id DESC',(err,data)=>{
        if(err) res.status(200).json({err:true,msg:err.sqlMessage})
        if(data) res.status(200).json({err:false,notes:data})
        
    })
})
//only authenticated (default)
router.get('/all/:uid',(req,res)=>{
    db.query('SELECT * FROM notes ORDER BY id DESC',(err,data)=>{
        let filteredNotes=data.filter((value) => JSON.parse(value.users).includes(req.params.uid))
        if(err) res.status(200).json({err:true,msg:err.sqlMessage})
        if(data) res.status(200).json({err:false,notes:filteredNotes})
        
    })
})
//only authenticated (default)
router.delete('/delete/:id',(req,res)=>{
    db.query('DELETE FROM notes WHERE id=?',[req.params.id],(err,data)=>{
        if(err) res.status(200).json({err:true,msg:err.sqlMessage})
        if(data) res.status(200).json({err:false,msg:'Document deleted successfully :)'})
    })
})
//only authenticated (default)
// router.get('/:uid',(req,res)=>{
//     db.query('SELECT * FROM notes ORDER BY id DESC',(err,data)=>{
//     if(err) res.json({err:true,msg:err.sqlMessage})
//     else{
//       let notes=data.filter((value) => JSON.parse(value.users).includes(req.params.uid))
//       res.json({err:false,notes})
// }
//     })
//   })



export default router