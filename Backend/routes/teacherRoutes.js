import express from "express";
const router = express.Router()
import { updateUsersTable ,provideUniqueId} from '../Middlewares/authMiddlewares.js'
import { db } from '../db.js'
import bcrypt from 'bcryptjs'
import { adminOnly,authenticatedOnly } from "./authRoutes.js";
router.use(adminOnly)
router.use(authenticatedOnly)
//authenticated & adminonly (default)
router.post('/addTeacher',provideUniqueId('Teachers','teacher'), (req, res) => {
    //Check for Existing Student
    let data = req.body
    
    db.query(`SELECT * FROM Teachers WHERE username=?`, data.username, (err, d) => {
        if (err) return res.status(200).json({err:true,msg:err.sqlMessage})
        else if (d.length) return res.status(200).json({err:true,msg:'Teacher already exists with same username'})
        else {
            let q = 'INSERT INTO Teachers SET ?';
            let {password,...otherData}=data 

            let values={...otherData,joiningDate:(new Date(data.joiningDate)),uid:req.uid}

            db.query(q, values, (err, data) => {
                (err)
                if (err) return res.status(200).json({err:true,msg:err.sqlMessage})
                let salt = bcrypt.genSaltSync(10)
                    const password = bcrypt.hashSync(req.body.password, salt)
                    let d={username:req.body.username,password,status:req.body.status,Uid:req.uid,isActive:req.body.isActive}
                    db.query(`INSERT INTO Users set ?`,d)
                     return res.status(200).json({ data,msg:'Teacher Added Successfully :)' });
            })
        }
    })
})
//authenticated & adminonly (default)
router.put('/updateTeacher/:id',(req, res) => {
    let data = req.body
    db.query(`SELECT * FROM Teachers WHERE username=? and uid!=?`, [data.username,req.params.id], (err, d) => {
        (d)
        if (err) res.json({err:true,msg:err.sqlMessage})
        else if (d.length) res.status(200).json({err:true,msg:'Teacher With Same Name Already Exists'})
        else {
            let {password,...otherData}=data
            let values ={...otherData,joiningDate:(new Date(data.joiningDate))}
           
            let q = 'Update Teachers SET ? WHERE `uid`=?';
            db.query(q, [values, req.params.id], (err, data) => {
                if (err) res.status(200).json({ err: true,msg:err.sqlMessage })
                else {
                    let salt = bcrypt.genSaltSync(10)
                    let d={username:req.body.username,status:req.body.status,Uid:req.params.id,isActive:req.body.isActive}
                    if(req.body.password!==''){
                        const password = bcrypt.hashSync(req.body.password, salt)
                        d['password']=password;
                    }
                    db.query(`UPDATE Users set ? WHERE uid=?`,[d,req.params.id,])
                     return res.status(200).json({ data,msg:'Teacher Updated Successfully :)' });
                }
            })
        }
    })
})
//authenticated & adminonly (default)
router.get('/all', (req, res) => {
    let query = `SELECT * FROM Teachers WHERE isActive=1`
    db.query(query, (err, data) => {
        if (err) return res.json({err:true,msg:err.sqlMessage})
        res.json(data)
    })
})
//disable teacher
//authenticated & adminonly (default)
router.delete('/moveToTrash/:uid',(req,res)=>{
    let params=[{isActive:0},req.params.uid]
    db.query('UPDATE Teachers SET ? WHERE uid=?',params,(err,data)=>{
        if(err) res.status(200).json({err:true,msg:err.sqlMessage})
        db.query('UPDATE Users set ? WHERE uid=?',params,(err,data)=>{
        if(err) res.status(200).json({err:true,msg:err.sqlMessage})
        else res.status(200).json({err:false,msg:'Teacher Moved to trash Successfully :)'});
        })
    })
})
//get teachers by array of ids
//authenticated & adminonly (default)
router.post('/getTeachersByList',(req,res)=>{
    (req.body)
    db.query('SELECT `fullName`,`dp`,`uid` FROM Teachers WHERE uid in (?) ',[req.body.list],(err,data)=>{
        (err)
        if (err) return res.json({err:true,msg:err.sqlMessage})
        else res.json(data)
    })
})

//get trashed teachers
//authenticated & adminonly (default)
router.get('/trashed',(req,res)=>{
    (req.body)
    db.query('SELECT * FROM Teachers WHERE isActive=0 ',(err,data)=>{
        (err)
        if (err) return res.json({err:true,msg:err.sqlMessage})
        else res.json(data)
    })
})

//enable teacher
//authenticated & adminonly (default)
router.post('/recover/:uid',(req,res)=>{
    let params=[{isActive:1},req.params.uid]
    db.query('UPDATE Teachers SET ? WHERE uid=?',params,(err,data)=>{
        if (err) return res.json({err:true,msg:err.sqlMessage}) 
        db.query('UPDATE Users set ? WHERE uid=?',params,(err,data)=>{
            if(err) res.status(200).json({err:true,msg:err.sqlMessage})
            else res.status(200).json({err:false,msg:'Teacher Enabled Successfully :)'});
            })
    })
})
//delete teacher permanantly
//authenticated & adminonly (default)
router.delete('/delete/:uid',(req,res)=>{
    db.query('DELETE FROM Teachers WHERE uid=?',[req.params.uid],(err,data)=>{
        if (err) return res.json({err:true,msg:err.sqlMessage})
        else
        db.query('DELETE FROM Users WHERE uid=?',[req.params.uid],(err,data)=>{
            if (err) return res.json({err:true,msg:err.sqlMessage})
            // also delete from Users
            else res.json({err:false,msg:'Teacher Deleted Successfully :)'})
    })

    })
})
export default router