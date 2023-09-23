import { db } from "../db.js"
export default function updateFeeStatus(){
    let date=new Date()
    let month=date.getMonth()+1
    if(month<=9) month='0'+month
    date=date.getFullYear()+'-'+month
    db.query('SELECT uid FROM Students WHERE isActive=1',(err,data)=>{
      if(err) return {err:true,msg:err.sqlMessage};
      let uids=data.map(value=>value.uid)//get all user ids and extract them
      db.query('SELECT uid FROM FeeHistory WHERE uid in (?) and month=? and status=?',[uids,date,'Paid'],(err,data)=>{
        if(!err){
        let PaidList=data.map(value=>value.uid)//get list of paid students
        let unpaidList=uids.filter(value=>!PaidList.includes(value));//get list of unpaid students
        if(PaidList.length){//if there are some advanced paid records of current month.. also update student's fee status
        db.query('UPDATE Students SET ? WHERE uid in (?) ',[{feeStatus:'Paid',},PaidList])
  }
        if(unpaidList.length){//check unpaid records if there is some record is missing.
          db.query('UPDATE Students SET ? WHERE uid in (?) ',[{feeStatus:'Unpaid',},unpaidList])
      db.query('SELECT uid FROM FeeHistory WHERE uid in (?) and month=? and status=?',[uids,date,'Unpaid'],(err,data)=>{
        if(err) return {err:true,msg:err.sqlMessage};
        let a=data.map(value=>value.uid)//extract uids
        let unRecordedList=unpaidList.filter(value=>!a.includes(value))
        let d=[]
        unRecordedList.forEach((value) => d.push([date,value,'Unpaid'])) //prepare data to insert
        if(unRecordedList.length) //finally insert those missing data in the table
        db.query("INSERT INTO `FeeHistory`(`month`, `uid`, `status`) VALUES ?",[d])
      })
      }
    }
      })
    })
  }