import express from "express";
import { db } from "../db.js";
import { adminOnly, authenticatedOnly } from "./authRoutes.js";
const router = express.Router()
//only admin can access
router.post('/add-class',adminOnly,(req,res)=>{
    let data=req.body;
    db.query('SELECT * FROM Classes WHERE className=?',[data.className,data.category],(err,d)=>{
        if(err) res.json({err:true,msg:err.sqlMessage});
        else if(d.length) res.json({err:true,msg:'Class with this name already exists !'})
        else{
            db.query('INSERT INTO Classes SET ?',data,(err,data)=>{
                if(err) return res.json({err:true,msg:err.sqlMessage});
                res.json({err:false,msg:'Class added successfully :)'});
            })
        }
    })
    

})

//get all classes. only authenticated users (default)
router.get('/getAllClasses',(req,res)=>{
    db.query('SELECT * FROM Classes',(err,data)=>{
        if(err) res.status(200).json({err:true,msg:err.sqlMessage})
        else res.status(200).json({err:false,classes:data})
    })
})
//update classes. only authenticated users (default)
router.post('/update/:id',(req,res)=>{
    db.query('UPDATE Classes SET ? WHERE id=?',[req.body,req.params.id],(err,data)=>{
        if(err) res.status(200).json({err:true,msg:err.sqlMessage})
        else res.status(200).json({err:false,msg:'Data Updated :)'})
    })
})
//only admin
router.delete('/delete/:id',adminOnly,(req,res)=>{
    db.query('DELETE FROM Classes WHERE id=?',[req.params.id],(err,data)=>{
        if(err) res.status(200).json({err:true,msg:err.sqlMessage})
        else res.status(200).json({err:false,msg:'Record Deleted Successfully'})
    })
})
// authenticated users (default)
router.get('/getSubjectsByClass/:className',(req,res)=>{
    const cn=req.params.className
    let query='SELECT * FROM Classes WHERE className=? and category=?'
    let parameters=[cn.split('-')[0],cn.split('-')[1]]
    // if(cn.split('-')[1]==='All') {
    //     query=`SELECT * FROM Classes WHERE SUBSTRING_INDEX(className, '-', 1)=?`
    //     parameters=cn.split('-')[0]
    // }
    db.query(query,parameters,(err,data)=>{
        if(err) res.status(200).json({err:true,msg:err.sqlMessage})
        else res.status(200).json({err:false,subjects:data[0]})
    })
})

export default router