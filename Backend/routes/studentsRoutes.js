import express from "express";
const router = express.Router();
import { db } from "../db.js";
import bcrypt from "bcryptjs";
import { provideUniqueId } from "../Middlewares/authMiddlewares.js";
import updateFeeStatus from "../Middlewares/FeeUpdater.js";
import { adminOnly, adminOrTeacher, authenticatedOnly } from "./authRoutes.js";

// add Students
router.post(
  "/addStudent",
  adminOnly,
  provideUniqueId("Students", "student"),
  (req, res) => {
    //Check for Existing Student
    let data = req.body;
    db.query(
      `SELECT * FROM Students WHERE username=? `,
      data.username,
      (err, d) => {
        if (err) return res.json(err);
        else if (d.length)
          return res
            .status(200)
            .json({ err: true, msg: "Student with this name already exists" });
        else {
          let { password, ...otherData } = data;
          let values = {
            ...otherData,
            joiningDate: new Date(data.joiningDate),
            uid: req.uid,
          };
          let q = "INSERT INTO Students SET ?";
          db.query(q, values, (err, data) => {
            if (err)
              return res.status(200).json({ err: true, msg: err.sqlMessage });
            else {
              let salt = bcrypt.genSaltSync(10);
              let d = {
                username: req.body.username,
                status: req.body.status,
                Uid: req.uid,
                isActive: req.body.isActive,
              };
              if (req.body.password !== "") {
                const password = bcrypt.hashSync(req.body.password, salt);
                d["password"] = password;
              }
              db.query(`INSERT INTO Users set ?`, d);
              res
                .status(200)
                .json({ data, msg: "Student Added Successfully :)" });
              updateFeeStatus();
              updateScheduleStatus(values, "add");
            }
          });
        }
      }
    );
  }
);
function updateScheduleStatus(values, type) {
  let className = values.class.split("-")[0];
  db.query(
    `SELECT * FROM manageSchedule WHERE substring_index(className, '-', 1)=?`,
    [className],
    (err, schedules) => {
      schedules.forEach((value) => {
        value.students = JSON.parse(value.students);
        if (type === "add") value.students.push(values.uid);
        else value.students.splice(value.students.indexOf(value.uid), 1);
        value.students = [...new Set(value.students)]; //remove duplicates
        db.query(`UPDATE manageSchedule SET ? WHERE sid=?`, [
          { students: JSON.stringify(value.students) },
          value.sid,
        ]);
      });
    }
  );
  if (type === "add") {
    let dataForNotification = {
      Auther: "Using default system",
      title: "New Schedule",
      content: "There are some test schedules for you. Click here to view!",
      users: JSON.stringify([values.uid]),
      db: "Students",
      link: "/Student/schedules",
    };
    db.query("INSERT INTO Notifications set ?", dataForNotification);
  }
}
//Update Students
router.put("/updateStudent/:id", adminOnly, (req, res) => {
  let data = req.body;
  db.query(
    `SELECT * FROM Students WHERE username=? and uid!=?`,
    [data.username, req.params.id],
    (err, d) => {
      if (err) return res.json({ err: true, msg: err });
      else if (d.length)
        return res
          .status(200)
          .json({ err: true, msg: "Student Already exists" });
      else {
        let q = "Update Students SET ? WHERE `uid`=?";
        let { password, ...otherData } = data;
        let values = { ...otherData, joiningDate: new Date(data.joiningDate) };
        db.query(q, [values, req.params.id], (err, data) => {
          if (err) res.status(200).json({ err: true, msg: err });
          else {
            let salt = bcrypt.genSaltSync(10);
            let d = {
              username: req.body.username,
              status: req.body.status,
              Uid: req.params.id,
              isActive: req.body.isActive,
            };
            if (req.body.password !== "") {
              const password = bcrypt.hashSync(req.body.password, salt);
              d["password"] = password;
            }
            db.query(`UPDATE Users set ? WHERE uid=?`, [d, req.params.id]);
            return res
              .status(200)
              .json({ data, msg: "Student Updated Successfully :)" });
          }
        });
      }
    }
  );
});

// Get all students
router.get("/all", adminOrTeacher, (req, res) => {
  let q = "SELECT * FROM Students WHERE isActive=1 ORDER BY id DESC";
  db.query(q, (err, data) => {
    if (err) res.status(200).json({ err: true, msg: err.sqlMessage });
    else res.status(200).json(data); //don't change this
  });
});
// Get all students (trashed+active)
router.get("/all-students", adminOrTeacher, (req, res) => {
  let q = "SELECT * FROM Students ORDER BY id DESC";
  db.query(q, (err, data) => {
    if (err) res.status(200).json({ err: true, msg: err.sqlMessage });
    else res.status(200).json(data); //don't change this
  });
});
// Get trashed students
router.get("/trashed", adminOnly, (req, res) => {
  let q = "SELECT * FROM Students WHERE isActive=0";
  db.query(q, (err, data) => {
    if (err) res.status(200).json({ err: true, msg: err.sqlMessage });
    else res.status(200).json(data);
  });
});
//recover a student by provided id
router.post("/recover/:uid", adminOnly, (req, res) => {
  let q = "UPDATE Students SET ? WHERE uid=?";
  db.query(q, [{ isActive: 1 }, req.params.uid], (err, data) => {
    if (err) res.status(200).json({ err: true, msg: err.sqlMessage });
    else {
      db.query(
        "UPDATE Users SET ? WHERE uid=?",
        [{ isActive: 1 }, req.params.uid],
        (err, data) => {
          if (err) res.status(200).json({ err: true, msg: err.sqlMessage });
          else
            res
              .status(200)
              .json({ err: false, msg: "Student recovered successfully :)" });
        }
      );
    }
  });
});
function deleteNotifications(uid) {
  db.query(`SELECT * FROM Notifications`, (err, notifications) => {
    notifications.forEach((value, index) => {
      let _users = JSON.parse(value.users);
      _users.splice(_users.indexOf(uid), 1);
      let views = JSON.parse(value.views);
      views.splice(_users.indexOf(uid), 1);
      db.query("UPDATE Notifications SET ? WHERE id=?", [
        { users: JSON.stringify(_users), views: JSON.stringify(views) },
        value.id,
      ]);
    });
  });
}
//permanantly delete any student by provided id
router.delete("/delete/:id", adminOnly, (req, res) => {
  db.query(
    "SELECT * FROM Students WHERE uid=?",
    [req.params.id],
    (err, students) => {
      if (!err) updateScheduleStatus(students[0], "delete");
    }
  );
  db.query("DELETE FROM Students WHERE uid=?", [req.params.id], (err, data) => {
    if (err) res.status(200).json({ err: true, msg: err.sqlMessage });
    else {
      deleteNotifications(req.params.id);
      db.query(
        "DELETE FROM Users WHERE uid=?",
        [req.params.id],
        (err, data) => {
          if (err) res.status(200).json({ err: true, msg: err.sqlMessage });
          else
            res
              .status(200)
              .json({ err: false, msg: "Student Permanantly deleted" });
        }
      );
    }
  });
});
// temporary disable any student
router.delete("/moveToTrash/:id", adminOnly, (req, res) => {
  db.query(
    `SELECT * FROM Students WHERE uid=?`,
    [req.params.id],
    (err, data) => {
      if (err) return res.status(200).json({ err: true, msg: err.sqlMessage });
      if (!data.length)
        return res
          .status(200)
          .json({ err: true, msg: `Student doesn't exist` });
      else {
        let v = [{ isActive: false }, req.params.id];
        db.query(`UPDATE Students SET ? WHERE uid=?`, v, (err, data) => {
          if (err)
            return res.status(200).json({ err: true, msg: err.sqlMessage });
          else {
            db.query(`UPDATE Users SET ? WHERE uid=?`, v);
            return res
              .status(200)
              .json({
                err: false,
                msg: "Student moved to trash successfully :)",
              });
          }
        });
      }
    }
  );
});

// <==================Fee Section Starts===========================>
router.post("/payfee/", adminOnly, (req, res) => {
  let orgIds = req.body.ids;
  if(!req.body.month) return res.json({err:true,msg:"Date can't be null."})
  //check if a students paid advance fee
  db.query(
    "SELECT uid from FeeHistory WHERE uid in (?) and month=?",
    [orgIds, req.body.month],
    (err, data) => {
      if (err) return res.json({ err: true, msg: err.sqlMessage });
      let uids = data.map((value) => value.uid); //extract uids of advance paid fees
      let existing = orgIds.filter((value) => uids.includes(value)); //existing records
      if (existing.length) {
        db.query(
          "UPDATE FeeHistory SET ? WHERE uid in (?) and month=?",
          [
            { submitting_date: req.body.submitting_date, status: "Paid" },
            existing,
            req.body.month,
          ],
          (err) => {
            if (err) return res.json({ err: true, msg: err.sqlMessage });
            else res.json({ err: false, msg: "Records Updated" });
          }
        );
      } else {
        let notExisting = orgIds.filter((value) => !uids.includes(value)); //exclude existing records
        //prepare data for new entries
        let entries = [];
        notExisting.forEach((value) =>
          entries.push([
            req.body.submitting_date,
            req.body.month,
            value,
            "Paid",
          ])
        );
        db.query(
          "INSERT INTO `FeeHistory`(`submitting_date`, `month`, `uid`, `status`) VALUES ?",
          [entries],
          (err, data) => {
            if (err) return res.json({ err: true, err: err.sqlMessage });
            res.json({ err: false, msg: "Records Updated" });
          }
        );
      }
    }
  );
  updateFeeStatus();
});
router.post('/update-fee/:id',(req,res)=>{
  db.query('UPDATE FeeHistory SET month=? WHERE id=?',[req.body.month,req.params.id],(err)=>{
    if(err) return res.json({err:true,msg:err.sqlMessage})
    updateFeeStatus()
    res.json({err:false,msg:"Record has been updated successfully."})
  })
})
router.delete('/delete-fee-record/:id',(req,res)=>{
  db.query('DELETE FROM FeeHistory WHERE id=?',[req.params.id],(err)=>{
    if(err) return res.json({err:true,msg:err.sqlMessage})
    updateFeeStatus()
    res.json({err:false,msg:"Record has been deleted successfully."})
  })
})
//get fee history of particular student
router.get("/paid-fee-records/:uid", adminOnly, (req, res) => {
  db.query(
    "SELECT * FROM FeeHistory WHERE uid=? and status=?",
    [req.params.uid, "Paid"],
    (err, data) => {
      if (err) return res.json({ err: true, msg: err.sqlMessage });
      else res.json({ err: false, history: data });
    }
  );
});
//get unpaid history of particular student
router.get("/unpaid-fee-records/:uid", adminOnly, (req, res) => {
  db.query(
    "SELECT * FROM FeeHistory WHERE uid=? and status=?",
    [req.params.uid, "Unpaid"],
    (err, data) => {
      if (err) return res.json({ err: true, msg: err.sqlMessage });
      else res.json({ err: false, history: data });
    }
  );
});
//get all data from feeHistory
router.get("/all-fee-records", adminOnly, (req, res) => {
  db.query("SELECT * FROM FeeHistory WHERE status=?", ["Paid"], (err, data) => {
    if (err) return res.json({ err: true, msg: err.sqlMessage });
    else res.json({ err: false, history: data });
  });
});
//get all unpaid records
router.get("/unpaid-fee-records", adminOnly, (req, res) => {
  db.query(
    "SELECT * FROM FeeHistory WHERE status=?",
    ["Unpaid"],
    (err, data) => {
      if (err) return res.json({ err: true, msg: err.sqlMessage });
      else res.json({ err: false, history: data });
    }
  );
});
// <==================Fee Section Ends===========================>

//get all classes
router.get("/getClasses", (req, res) => {
  db.query(`SELECT * FROM Classes`, (err, data) => {
    if (err) return res.status(200).json({ err: true, msg: err.sqlMessage });
    else {
      res.status(200).json(data);
    }
  });
});
//get students of provided class
router.get("/getStudentsByClass/:class", adminOnly, (req, res) => {
  let className = req.params.class;
  let query = "SELECT * FROM Students WHERE class=? and isActive=1";
  if (className.split("-")[1] === "All") {
    query = `SELECT * FROM Students WHERE SUBSTRING_INDEX(class, '-', 1)=? and isActive=1`;
    className = className.split("-")[0];
  }
  db.query(query, [className], (err, students) => {
    if (err) res.status(200).json({ err: true, msg: err.sqlMessage });
    else {
      res.status(200).json({ err: false, students });
    }
  });
});

//get particular student details
router.get("/getStudentById/:uid", adminOrTeacher, (req, res) => {
  db.query(
    `SELECT * FROM Students WHERE uid=? and isActive=1`,
    [req.params.uid],
    (err, data) => {
      if (err) res.status(200).json({ err: true, msg: err.sqlMessage });
      else res.status(200).json({ err: false, student: data[0] });
    }
  );
});

//get students by array of ids
router.post("/getStudentsByList", adminOnly, (req, res) => {
  db.query(
    `SELECT * FROM Students WHERE uid in (?) ORDER BY id DESC`,
    [req.body.list],
    (err, data) => {
      if (err) return res.json({ err: true, msg: err.sqlMessage });
      else res.json(data);
    }
  );
});

//get ids of all the students of specific class
router.get("/getIdsByClass/:class", adminOnly, (req, res) => {
  db.query(
    "SELECT uid FROM Students WHERE class=? and isActive=1",
    [req.params.class],
    (err, data) => {
      if (err) return res.json({ err: true, msg: err.sqlMessage });
      else {
        let ids = data.map((value) => value.uid);
        return res.json({ err: true, Uids: ids });
      }
    }
  );
});

//permote students (simply update their classes)
router.put("/permoteStudentsByList", adminOnly, (req, res) => {
  db.query(
    "UPDATE Students set `class`=? WHERE uid in (?) and isActive=1",
    [req.body.className, req.body.students],
    (err, data) => {
      if (err) return res.json({ err: true, msg: err.sqlMessage });
      else res.json({ err: false, msg: "Students permoted successfully :)" });
    }
  );
});
// function getAdmissionsPercentageByMonth(students) {
//   const now = new Date();
//   const currentYear = now.getFullYear();
//   const admissionsByMonth = {};
//   const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
//                   'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
//   students.forEach(student => {
//     const joiningDate = new Date(student.joiningDate);
//     const year = joiningDate.getFullYear();
//     if (year === currentYear) {
//       const monthIndex = joiningDate.getMonth();
//       const monthName = months[monthIndex];
//       if (!admissionsByMonth[monthName]) {
//         admissionsByMonth[monthName] = 0;
//       }
//       admissionsByMonth[monthName]++;
//     }
//   });
//   const totalAdmissions = Object.values(admissionsByMonth).reduce((acc, val) => acc + val, 0);
//   const admissionsPercentageByMonth = Object.entries(admissionsByMonth).map(([month, count]) => {
//     const percentage = ((count / totalAdmissions) * 100).toFixed(0) + '%';
//     return { month, percentage };
//   });
//   return admissionsPercentageByMonth;
// }
function getAdmissionsPercentageByMonth(students) {
  const now = new Date();
  const currentYear = now.getFullYear();
  const admissionsByMonth = { Male: {}, Female: {} };
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  students.forEach((student) => {
    const joiningDate = new Date(student.joiningDate);
    const year = joiningDate.getFullYear();
    if (year === currentYear) {
      const monthIndex = joiningDate.getMonth();
      const monthName = months[monthIndex];
      const gender = student.gender;
      if (!admissionsByMonth[gender][monthName]) {
        admissionsByMonth[gender][monthName] = 0;
      }
      admissionsByMonth[gender][monthName]++;
    }
  });
  const admissionsPercentageByMonth = months.map((name) => {
    const FemaleCount = admissionsByMonth.Female[name] || 0;
    const MaleCount = admissionsByMonth.Male[name] || 0;
    const totalCount = FemaleCount + MaleCount;
    const Girls =
      FemaleCount > 0 ? Number(((FemaleCount / totalCount) * 100).toFixed(0)) : 0;
    const Boys =
      MaleCount > 0 ? Number(((MaleCount / totalCount) * 100).toFixed(0)) : 0;
    return { name, Girls, Boys };
  });
  return admissionsPercentageByMonth;
}
function getGenderPercentage(students) {
  const totalStudents = students.length;
  const maleStudents = students.filter(
    (student) => student.gender === "Male"
  ).length;
  const femaleStudents = totalStudents - maleStudents;
  const malePercentage = Number(((maleStudents / totalStudents) * 100).toFixed(1));
  const femalePercentage = Number(((femaleStudents / totalStudents) * 100).toFixed(1));
  return { malePercentage, femalePercentage };
}

router.get("/studentsInfoGenderWise", (req, res) => {
  db.query("SELECT * FROM Students WHERE isActive=1", (err, students) => {
    if (err) return res.json({ err: true, msg: err.sqlMessage });
    res
      .status(200)
      .json({
        admissions: getAdmissionsPercentageByMonth(students),
        percentage: getGenderPercentage(students),
      });
  });
});

router.get("/getFeeInfo", (req, res) => {
  db.query("SELECT * FROM FeeHistory", (err, data) => {
    let totalRecords = data.length;
    let unpaidRecords = data.filter(
      (value) => value.status === "Unpaid"
    ).length;
    res.status(200).json(((unpaidRecords / totalRecords) * 100).toFixed(1));
  });
});

export default router;
