import express from "express";
const router = express.Router();
import { db } from "../db.js";
import { adminOnly, authenticatedOnly } from "./authRoutes.js";
router.use(authenticatedOnly)
router.post("/addNotification",adminOnly, (req, res) => {
  db.query("INSERT INTO Notifications set ?", req.body, (err, data) => {
    if (err) res.status(200).json({ err: true, msg: err.sqlMessage });
    else
      res
        .status(200)
        .json({ err: false, msg: "Notification Sent Successfully :)" });
  });
});

//get all notifications
router.get("/all",adminOnly, (req, res) => {
  db.query("SELECT * FROM Notifications ORDER BY id DESC", (err, data) => {
    if (err) res.status(200).json({ err: true, msg: err.sqlMessage });
    else res.status(200).json({ err: false, notifications: data });
  });
});

// //get all notifications of a particular students
// router.get("/all/:uid", (req, res) => {
//   db.query("SELECT * FROM Notifications ORDER BY id DESC", (err, data) => {
//     let parsedData=data;
//     parsedData.filter((value) => (JSON.parse(value.users).includes(req.params.uid)))
//     if (err) res.status(200).json({ err: true, msg: err.sqlMessage });
//     else res.status(200).json({ err: false, notifications: parsedData });
//   });
// });

router.delete("/deleteNotification/:id",adminOnly, (req, res) => {
  db.query(
    "DELETE FROM Notifications WHERE id=?",
    req.params.id,
    (err, data) => {
      if (err) return res.json({ err: true, msg: err.sqlMessage });
      else res.json({ err: false, msg: "Notification deleted successfully :)" });
    }
  );
});

//get Total number of unseen notifications by id. only authenticated(default)
router.get('/getNotificatoinsCount/:uid',(req,res)=>{
  db.query('SELECT * FROM Notifications',(err,data)=>{
    if(err) res.status(200).json({err:true,msg:err.sqlMessage})

    else{
      let _data=data.filter((value) => JSON.parse(value.users).includes(req.params.uid) && !(JSON.parse(value.views).includes(req.params.uid)))
       res.status(200).json({err:false,count:_data.length})
      }
  })
})


//only authenticated (default)
//get actuall unseen notifications by id and set them as seen
router.get('/getUnseenNotificationsById/:uid',(req,res)=>{
  db.query('SELECT * FROM Notifications  ORDER BY id DESC',(err,data)=>{
    if(err) res.status(200).json({err:true,msg:err.sqlMessage})
    else{
      let _data=data.filter((value) => JSON.parse(value.users).includes(req.params.uid) && !JSON.parse(value.views).includes(req.params.uid))
      res.status(200).json({err:false,notifications:_data})
     
      }
  })
})

//only authenticated (default)
router.post('/markViewed',(req,res)=>{
  db.query('SELECT * FROM Notifications WHERE id in (?)',[req.body.ids],(err,data)=>{
    if(err) res.json({err:true,msg:err.sqlMessage})
    else{
      data.forEach((value) => {
        let notification=JSON.parse(value.views)
        //This condition is to prevent duplicate entries as react app renders twice in strict mode.
        if(!notification.includes(req.body.uid)) notification.push(req.body.uid)
        db.query('UPDATE Notifications SET ? WHERE id=?',[{views:JSON.stringify(notification)},value.id])
      })
      res.json({err:false,msg:'Successfully marked as viewed!'})
    }
  })
  })

  //get all notifications for the user
//only authenticated (default)
  router.get('/getAllNotifications/:uid',(req,res)=>{
    db.query('SELECT * FROM Notifications  ORDER BY id DESC',(err,data)=>{
      if(err) res.status(200).json({err:true,msg:err.sqlMessage})
      else{
        let _data=data.filter(value => JSON.parse(value.users).includes(req.params.uid));
        
        res.status(200).json({err:false,notifications:_data})
        }
    })
  })
export default router;