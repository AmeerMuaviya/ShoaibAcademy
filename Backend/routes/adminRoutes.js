import express from "express";
const router = express.Router()
import bcrypt from 'bcryptjs'

import { db } from '../db.js'
import {provideUniqueId} from '../Middlewares/authMiddlewares.js'
import { adminOnly } from "./authRoutes.js";


// router.use(adminOnly)
router.post('/add',provideUniqueId('Admins','admin'),(req,res)=>{
    db.query('SELECT * FROM Admins WHERE username=?',req.body.username,(err,data)=>{
        if(err) 
            res.status(200).json({err:true,msg:err.sqlMessage})       
        else if(data.length)
            res.status(200).json({err:true,msg:'Admin with same username already exists'})
        else{
            let d={username:req.body.username,status:'Admin',uid:req.uid,fullName:req.body.fullName}
            db.query('INSERT INTO Admins SET ?',d,(err)=>{
                if(err) {
                    res.status(200).json({err:true,msg:err.sqlMessage})
                }
                else {
                    let salt = bcrypt.genSaltSync(10)
                    const password = bcrypt.hashSync(req.body.password, salt)
                    db.query(`INSERT INTO Users set ?`,{uid:req.uid,username:req.body.username,password,isActive:true,status:'Admin'},(err,data)=>{
                        if(err) return res.status(200).json({err:true,msg:err.sqlMessage})      
                        res.status(200).json({err:false,msg:'Admin added successfully'})
                    })//Add into users table
                }
            })
        }
    })
})

router.get('/all',(req,res)=>{
    db.query('SELECT * FROM Admins',(err,data)=>{
       if(err) res.status(200).json({err:true,msg:err.sqlMessage})       
       res.status(200).json({err:true,admins:data})

    })
})

router.delete('/delete/:uid',(req,res)=>{
    db.query('DELETE FROM Admins WHERE uid=?',[req.params.uid],(err,data)=>{

       if(err) return res.status(200).json({err:true,msg:err.sqlMessage})      
       db.query('DELETE FROM Users WHERE uid=?',[req.params.uid],(err,data)=>{
       if(err)return res.status(200).json({err:true,msg:err.sqlMessage})      
       res.status(200).json({err:false,msg:'Admin Deleted successfully :)'})

       }) 
    })
})

router.post('/update/:uid',(req,res)=>{
    db.query('SELECT * FROM Admins WHERE uid=?',[req.params.uid],(err,admins)=>{
       if(err)res.status(200).json({err:true,msg:err.sqlMessage})     
       else if(!admins.length) res.status(404).json({err:true,msg:'User not found'}) 
        else{
            let {username,fullName}=req.body.data
            db.query('UPDATE Admins SET `username`=? , `fullName`=? WHERE uid=?',[username,fullName,req.params.uid],(err,data)=>{
                if(err)res.status(200).json({err:true,msg:err.sqlMessage})     
                else{
                    let query='UPDATE Users SET `username`=? WHERE uid=?'
                    let params=[username,req.params.uid]
                    if(req.body.data.password){
                    query='UPDATE Users SET `username`=? , `password`=? WHERE uid=?'
                    let salt = bcrypt.genSaltSync(10)
                    const password = bcrypt.hashSync(req.body.data.password, salt)
                    params=[username,password,req.params.uid]
                    }
                    db.query(query,params,(err,data)=>{
                if(err)res.status(200).json({err:true,msg:err.sqlMessage})     
                        else res.status(200).json({err:false,msg:'Admin updated successfully :)'})
                    })
                }
            })
        }
    })
})


export default router