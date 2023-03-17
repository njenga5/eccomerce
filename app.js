import express from "express";
import dotenv from "dotenv";
import session from "express-session";
import nunjucks from "nunjucks";
import path from "path";
import bodyparser from "body-parser";

import db from "./dbcfg/index.js";
import merch from "./routes/merch.js";
import users from "./routes/users.js";
import cart from "./routes/cart.js";

dotenv.config();

db.serialize(() => {
  db.run(
    "CREATE TABLE IF NOT EXISTS users (fname text, lname text, email text, password text, isadmin tinyint DEFAULT 0)",
    (err) => {
      err && console.log(err.message);
      console.log("users table created");
    }
  )
    .run(
      "CREATE TABLE IF NOT EXISTS products (title text, size text, color text, price double(10, 2), image_urls text, description text)",
      (err) => {
        err && console.log(err.message);
        console.log("product table created");
      }
    )
    .run(
      `CREATE TABLE IF NOT EXISTS cart (items text, count integer default 0, userid integer, FOREIGN KEY (userid)
    REFERENCES users (rowid) 
       ON UPDATE CASCADE
       ON DELETE CASCADE)`,
      (err) => {
        err && console.log(err.message);
        console.log("cart table created");
      }
    )
    .run(
      `CREATE TABLE IF NOT EXISTS cart_product (cartid integer, productid integer, FOREIGN KEY (cartid)
    REFERENCES cart (rowid) 
       ON UPDATE CASCADE
       ON DELETE CASCADE, FOREIGN KEY (productid)
    REFERENCES products (rowid)
        ON UPDATE CASCADE
        ON DELETE CASCADE)`,
      (err) => {
        err && console.log(err.message);
        console.log("cart_product table created");
      }
    );
});

const PORT = process.env.PORT || 5000;
const app = express();

nunjucks.configure("views", {
  autoescape: true,
  express: app,
  watch: true,
});
app.use(express.json());
app.use(bodyparser.urlencoded({ extended: true }));
// app.use(cors({ origin: "*" }));
app.use(session({ secret: process.env.KEY, resave: false, saveUninitialized: false }));
app.use("/static", express.static(path.join(path.resolve(), "public")));
app.use("/merch", merch);
app.use("/users", users);
app.use("/cart", cart);

app.get("/", (req, res) => {
  res.redirect(301, '/merch');
});
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
