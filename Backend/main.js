import express from 'express'
import { db } from './db.js'
import multer from 'multer'
import cors from 'cors'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import cookieparser from 'cookie-parser'
import authentication, { adminOnly, adminOrTeacher, authenticatedOnly } from './routes/authRoutes.js'
import studentsRoutes from './routes/studentsRoutes.js'
import teacherRoutes from './routes/teacherRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import scheduleRoutes from './routes/scheduleRoutes.js'
import classesRoutes from './routes/classesRoutes.js'
import notificatons from './routes/notificationRoutes.js'
import users from './routes/userRoutes.js'
import cron from 'node-cron'
import fs from 'fs'
import notes from './routes/notesRoutes.js'
import updateFeeStatus from './Middlewares/FeeUpdater.js'
import NotifyAdmin from './routes/notifyAdmins.js'
import blogs from './routes/blogs.js'
dotenv.config()

cron.schedule('0 0 1 * *', () => {
  // Schedule a task to run on the first day of every month 12:00 
  //0 0 1 * *
  //this cron should run on first of every month
  updateFeeStatus();
});

const port = 4000
const app = express()
app.use(express.json())
app.use(cors({ credentials: true,origin:true }))
// app.use(cors({ credentials: true,origin:'http://localhost:3000' }))
app.use(bodyParser.json());

app.use(cookieparser())
app.use('/auth',authentication) // all authentication routes
app.use('/students',studentsRoutes) // all students stuff here (crud)
app.use('/teachers',teacherRoutes) // all teacherRoutes here
app.use('/admins',adminRoutes) // all teacherRoutes here
app.use('/schedules',scheduleRoutes) // all schedules here
app.use('/classes',classesRoutes) // all classes here
app.use('/notifications',notificatons) // all notifications here
app.use('/users',users) // all users here
app.use('/notes',notes) // all notes here
app.use('/notifyAdmin',NotifyAdmin) // all admin notifications here
app.use('/blogs',blogs) // all blogs here
let __dirname = process.cwd();
db.connect((err, res) => {
  if (err) console.log(err)
  else console.log('Connected to db')
})
function fileUploader(filePath){
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, filePath)
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + file.originalname)
    }
  })
  return multer({ storage })
}

app.post('/user/uploadDp',adminOnly, fileUploader(__dirname+'/images/').single('dp'), function (req, res) {
  if (req.file) res.status(200).json(req.file.filename)
  else res.status(200).json(null)
});

app.post('/user/uploadBlogImg',adminOnly, fileUploader(__dirname+'/blogImages/').single('image'), function (req, res) {
  if (req.file) res.status(200).json(req.file.filename)
  else res.status(200).json(null)

});

app.post('/user/uploadNotes',adminOrTeacher,fileUploader(__dirname+'/Documents/').single('doc'), function (req, res) {
  if (req.file) res.status(200).json(req.file.filename)
  else res.status(200).json(null)

});

app.get('/getfile/:fileName',authenticatedOnly,(req,res)=>{
    const file=__dirname+`/images/${req.params.fileName}`
try {
  if (fs.existsSync(file)) {
    res.download(file,req.params.fileName)
  }
  else res.sendFile(__dirname+`/images/404.jpg`)
} catch(err) {
  res.json(err)
}
})

app.get('/getdoc/:fileName',authenticatedOnly,(req,res)=>{
    const file=__dirname+`/Documents/${req.params.fileName}`
try {
  if (fs.existsSync(file)) {
    res.download(file,req.params.fileName)
  }
  else res.sendFile(__dirname+`/images/404.jpg`)
} catch(err) {
  res.json(err)
}
})

app.get('/getBlogImg/:fileName',(req,res)=>{
    const file=__dirname+`/blogImages/${req.params.fileName}`
try {
  if (fs.existsSync(file)) {
    res.download(file,req.params.fileName)
  }
  else res.sendFile(__dirname+`/images/404.jpg`)
} catch(err) {
  res.json(err)
}
})

app.get('/', (req, res) => {
  res.json('this api isn`t working. HAHAH..!')
})

app.get('/subjects',(req,res)=>{
  fs.readFile('./Subjects.json', 'utf-8', (err, data) => {
    if (err) {
      res.status(404).json({err})
    } else {
      res.status(200).json({subjects:JSON.parse(data).subjects})
    }
    })
})
app.post('/update-subjects',(req,res)=>{
  let data=JSON.stringify({subjects:req.body.data})
  fs.writeFile('./Subjects.json', data, (err) => {
    if (err) {
      res.status(404).json({err})
    } else {
      res.status(200).json({msg:'Successfully updated'})
    }
    })
})

app.listen(port,()=>{
  console.log(`SERVER RUNNING ON http://localhost:${port}`);
  updateFeeStatus();
})