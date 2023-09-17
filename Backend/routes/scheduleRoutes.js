import express from "express";
import { db } from "../db.js";
import { adminOrTeacher, authenticatedOnly } from "./authRoutes.js";
const router = express.Router()

router.use(authenticatedOnly)
function hasMatchingElements(arr1, arr2) {
    return arr1.some(item => arr2.includes(item))
  }
  
function getUidStudentsBySubjects(req,res,next){
    //extract subjects from the schedule data
    let subjects=req.body.data.map((value) => Object.keys(value.subject));
    // concat them in single array
    subjects=[].concat(...subjects)
    // get all students by provided class
 db.query(`SELECT * FROM Students WHERE substring_index(class, '-', 1)=?`,[req.body.className.split('-')[0]],(err,students)=>{
       let uids=students.map((value) => {
            if(hasMatchingElements(subjects,(JSON.parse(value.subjects))))
            return value.uid;
        })
        uids=uids.filter((value) => value!==undefined);
        // if(!uids.length)
        //     return res.json({err:true,msg:'No Students found for given class'})
        req.body['students']=JSON.stringify(uids);
        next();
    })
}
//add a new schedule
router.post('/addSchedule',adminOrTeacher,getUidStudentsBySubjects,(req,res)=>{
    
    let {data,...otherData}=req.body
    let values={...otherData,data:JSON.stringify(data),isActive:1}
    let dataForNotification={
        Auther:values.teacherName,
        title:'New Schedule',
        content:'New Schedule added for you. Click on the button to view.',
        users:values.students,
        db:'Students',
        link:'/Student/schedules'
    }
    db.query(`INSERT INTO manageSchedule set ?`,[values],(err)=>{

        if(err) res.status(200).json({err:true,msg:err.sqlMessage})
        // else res.status(200).json('Schedule added Successfully')
        else{
            db.query("INSERT INTO Notifications set ?", dataForNotification, (err) => {
                if (err) res.status(200).json({ err: true, msg: err.sqlMessage });
                else
                  res
                    .status(200)
                    .json({ err: false, msg: "Schedule added Successfully :)" });
              });
        }
    })
})

//update an existing schedule
router.post('/updateSchedule/:id',adminOrTeacher,getUidStudentsBySubjects,(req,res)=>{
    let {data,...otherData}=req.body
    let values={...otherData,data:JSON.stringify(data)}
    let dataForNotification={
        Auther:values.teacherName,
        title:'Schedule Updated',
        content:'New Schedule added for you. Click on the button to view.',
        users:values.students,
        db:'Students',
        link:`/Student/schedules#${values.sid}`
    }
    db.query(`UPDATE manageSchedule SET ? WHERE sid=?`,[values,req.params.id],(err,data)=>{
        if(err) res.status(200).json({err:true,msg:err.sqlMessage})
        else{
            db.query("INSERT INTO Notifications set ?", dataForNotification, (err) => {
                if (err) res.status(200).json({ err: true, msg: err.sqlMessage });
                else
                  res
                    .status(200)
                    .json({ err: false, msg: "Schedule Updated Successfully :)" });
              });
        }
    })
})

//update an existing schedule
router.post('/addResult/:id',adminOrTeacher,(req,res)=>{

    let {data,...otherData}=req.body
    let values={...otherData,data:JSON.stringify(data)}
    db.query(`UPDATE manageSchedule SET ? WHERE sid=?`,[values,req.params.id],(err,data)=>{
        if(err) res.status(200).json({err:true,msg:err.sqlMessage})
        else res.status(200).json({err:false,msg:"Schedule update successfully :)"})
    })
})

//get all schedules
//only authenticated (default)
router.get('/getAllSchedules',(req,res)=>{
    db.query(`SELECT * FROM manageSchedule WHERE isActive=1 ORDER BY id DESC`,(err,schedules)=>{
        if(err) res.status(200).json({err:true,msg:err})
        else res.status(200).json({err:false,schedules})
    })
})

//get trashed schedules
router.get('/trashed',adminOrTeacher,(req,res)=>{
    db.query(`SELECT * FROM manageSchedule WHERE isActive=0 ORDER BY id DESC`,(err,schedules)=>{
        if(err) res.status(200).json({err:true,msg:err})
        else res.status(200).json({err:false,schedules})
    })
})

//get schedules with particular id
//only authenticated (default)
router.get('/getScheduleById/:id',(req,res)=>{
    db.query(`SELECT * FROM manageSchedule WHERE sid=? and isActive=1`,[req.params.id],(err,schedules)=>{
        if(err) res.json(err)
        else{
            res.json({err:false,schedules})
        }
    })
})


//get list of schedules sent to particular student
router.get('/getSchedulesByStudentId/:uid',(req,res)=>{
    db.query(`SELECT * FROM manageSchedule WHERE isActive=1 ORDER BY id DESC`,(err,data)=>{
        const schedules=data.filter((value) => JSON.parse(value.students).includes(req.params.uid))
        res.status(200).json({schedules})
    })
})

//only authenticated (default)
router.get('/getStudentsOfSchedule/:sid',(req,res)=>{
    db.query('SELECT * FROM manageSchedule WHERE sid=? and isActive=1',[req.params.sid],(err,data)=>{
        if(err)return res.json({err:true,msg:err.sqlMessage})
        let students=JSON.parse(data[0].students)
        if(!students.length) return res.status(200).json({err:false,students})
        db.query('SELECT * from Students where uid in (?)',[students],(err,students)=>{
            if(err)return res.json({err:true,msg:err.sqlMessage})
            return res.json({err:false,students})
        })
    })
})

//get Result by id 
//only authenticated (default)
router.post('/getResultById/:sid',(req,res)=>{
    db.query(`SELECT * FROM manageSchedule WHERE sid=? and isActive=1`,[req.params.sid],(err,data)=>{
        if(err) res.status(200).json({err:true,msg:err.sqlMessage})
        else{
            let sdata=JSON.parse(data[0].data)
            let result=sdata.filter((value) => value.date===req.body.date)
            let {className,testType}=data[0]
            res.status(200).json({err:false,...result[0],className,testType})
        }
    })
})

//delete schedule
router.delete('/deleteSchedule/:sid',adminOrTeacher,(req,res)=>{
    db.query('DELETE FROM manageSchedule WHERE sid=?',[req.params.sid],(err,data)=>{
        if(err) res.status(200).json({err:true,msg:err.sqlMessage})
        else res.status(200).json({err:false,msg:'Schedule deleted Successfully :)'})
    })
})

//only authenticated (default)
router.get('/getAllSchedulesByClass/:className',(req,res)=>{
    let className=req.params.className;
    let _class=className.split('-')[0]+'-All';
    let query=`SELECT * FROM manageSchedule WHERE className=? or className=? and isActive=1 ORDER BY id DESC`;
    db.query(query,[className,_class],(err,schedules)=>{
        if(err) res.status(200).json({err:true,msg:err.sqlMessage})
        else res.status(200).json({err:false,schedules})
    })
})
router.post('/disableSchedule/:sid',adminOrTeacher,(req,res)=>{
    db.query('UPDATE manageSchedule SET ? WHERE sid=?',[{isActive:0},req.params.sid],(err,data)=>{
        if(err) res.status(200).json({err:true,msg:err.sqlMessage})
        else res.status(200).json({err:false,msg:'Schedule moved to trash successfully :)'})
    })
})
router.post('/enableSchedule/:sid',adminOrTeacher,(req,res)=>{
    db.query('UPDATE manageSchedule SET ? WHERE sid=?',[{isActive:1},req.params.sid],(err,data)=>{
        if(err) res.status(200).json({err:true,msg:err.sqlMessage})
        else res.status(200).json({err:false,msg:'Schedule recovered successfully :)'})
    })
})
//only authenticated (default)
router.get('/getAllSchedulesByClass/:className/:testType',(req,res)=>{
        let query=`SELECT * FROM manageSchedule WHERE className=? and testType=? and isActive=1 ORDER BY id DESC`
    db.query(query,[req.params.className,req.params.testType],(err,schedules)=>{
        if(err) res.status(200).json({err:true,msg:err.sqlMessage})
        else res.status(200).json({err:false,schedules})
    })
})

router.get('/schedulesInfo',(req,res)=>{
    db.query('SELECT * FROM manageSchedule WHERE isActive=1',(err,data)=>{
        if(err) return res.json({err:true,msg:err.sqlMessage})
        let resultCount=0;
        let totalSchedules=0;
        data.forEach((value) => {
            let data=JSON.parse(value.data)
            data.forEach((value) => {
                totalSchedules+=1;
                if(Object.keys(value.subject).length!==Object.keys(value.result).length)
                    resultCount+=1;
            })
        })
        res.status(200).json(((resultCount/totalSchedules)*100).toFixed(1))
    })
})
function formatDate(date) {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString();
    const year = date.getFullYear();
    return `${month}-${day}-${year}`;
  }
router.get('/todaysTests/:className',(req,res)=>{
    let q=`SELECT * FROM manageSchedule WHERE isActive=1`
    let params=[]
    if(req.params.className!=='all'){
        q=`SELECT * FROM manageSchedule WHERE isActive=1 and className=?`
        params=[req.params.className]
    }
    db.query(q,params,(err,schedules)=>{
        if(err)return res.status(200).status({err:true,msg:err.sqlMessage})
        let todaysDate=formatDate(new Date())
        let data=[]
        data=schedules.map((_value) => {
            let arr= JSON.parse(_value.data).filter((value) => value.date===todaysDate)
            if(arr.length){
                arr.forEach((value) =>{
                    value['className']=_value.className;
                    value['sid']='sid'+_value.sid;
                })
                return arr;
            }
        })
        data=[].concat(...data)
        data=data.filter((value) => value)
        res.status(200).json(data)
    })
})

export default router