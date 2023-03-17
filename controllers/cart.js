import db from "../dbcfg/index.js";
import cart from "../models/cart.js";

export const addToCart = (req, res) => {
  db.get("SELECT items, rowid FROM cart WHERE rowid=?", [req.body.cartid], (err, row) => {
    if (err) {
      console.log(err.message);
      return res.status(500).json({ message: "An error occurred" });
    }
    cart.items.push(req.body.product);
    if (row) {
      cart.items.push(JSON.parse(row.items));
      db.run(
        `UPDATE cart SET count = ?, items = ? WHERE rowid = ?`,
        [row.count++, JSON.stringify(cart.items), row.rowid],
        (err) => {
          if (err) {
            console.log(err.message);
            return res.status(500).json({ message: "An error occurred" });
          }
          return res.json({ message: "Item Added to Cart", product: req.body.product });
        }
      );
    } else {
      db.run("INSERT INTO cart VALUES (?, ?, ?)", [
        JSON.stringify(cart.items),
        1,
        req.session.user.rowid,
      ]).run(
        "INSERT INTO cart_product VALUES (?, ?)",
        [req.body.cartid, req.body.product.rowid],
        (err) => {
          if (err) {
            console.log(err.message);
            return res.status(500).json({ message: "An error occurred" });
          }
          return res.json({ message: "Item Added to Cart", product: req.body.product });
        }
      );
    }
  });
};

export const removeFromCart = (req, res) => {
  db.get("SELECT items FROM cart WHERE rowid=?", [req.body.cartid], function (err, row) {
    if (err) {
      console.log(err.message);
      return res.status(500).json({ message: "An error occurred" });
    }
    if(row) {
      const items = JSON.parse(row.items).filter((item)=>{
        item.rowid !== req.body.product.rowid
      })
      db.run("UPDATE cart SET items=? WHERE rowid=?", [JSON.stringify(items), req.body.cartid], (err)=>{
        if(err){
          console.log(err.message);
          return res.status(500).json({message: "An error occurred"})
        }
        return res.json({message: "Item removed from cart", success: true})
      })
    }
  });
};

export const getCartItems = (req, res) => {
  db.all("SELECT * FROM cart WHERE rowid=?", [req.body.cartid], (err, rows)=>{
    if(err){
      console.log(err.message);
      return res.status(500).json({message: "An error occurred"})
    }
    return res.json({data: rows})
  })
};
