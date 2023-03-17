import db from "../dbcfg/index.js";
import user from "../models/user.js";

export const createNewUser = (req, res) => {
  db.serialize(() => {
    db.get("SELECT fname FROM users WHERE email=?", [req.body.email], (err, row) => {
      if (err) {
        console.log(err.message);
        return res.status(500).json({ data: "An error occured" });
      }

      if (row) {
        return res.status(400).json({ data: "User already exists" });
      } else {
        db.run(
          "INSERT INTO users(fname, lname, email, password) VALUES (?, ?, ?, ?)",
          Object.values(req.body),
          (err) => {
            if (err) {
              console.log(err.message);
              return res.status(500).json({ status: "fail" });
            } else {
              res.redirect("/users/login");
            }
          }
        );
      }
    });
  });
};

export const getOneUser = (req, res) => {
  db.get(
    "SELECT fname, lname, rowid FROM users WHERE email=? AND password=?",
    [req.body.email, req.body.password],
    (err, row) => {
      if (err) {
        console.log(err.message);
        return res.status(500).json({ message: "An error occured" });
      }
      if (row) {
        user.firstname = row.fname;
        user.lastname = row.lname;
        user.id = row.rowid;
        req.session.user = user;
        res.redirect('/merch');
      } else {
        res.status(404).json({ message: "User not found" });
      }
    }
  );
};
