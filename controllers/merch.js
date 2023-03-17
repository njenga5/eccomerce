import db from "../dbcfg/index.js";
import parser from "./parser.js";

export const getAllMerch = (req, res) => {
  db.all("SELECT rowid, * FROM products", (err, rows) => {
    if (err) {
      console.log(err.message);
      return res.status(500).json({ message: "An error occurred" });
    }
    const products = rows.map((row) => {
      return {
        ...row,
        ...parser(row),
      };
    });
    return res.render("pages/home.html", { products, data: req.session });
  });
};

export const createNewMerch = (req, res) => {
  const product = req.body;
  db.run(
    "INSERT INTO products VALUES (?, ?, ?, ?, ?, ?)",
    [
      product.title.toLowerCase(),
      JSON.stringify(product.size),
      JSON.stringify(product.color),
      product.price,
      JSON.stringify(product.image_urls),
      product.description,
    ],
    (err) => {
      if (err) {
        console.log(err.message);
        return res.status(500).json({ message: "An error occurred" });
      }
      return res.json({ message: "Product created", product });
    }
  );
};

export const updateMerch = (req, res) => {
  db.run(
    "UPDATE products SET name=?, description=?, price=?, image=?, category=? WHERE rowid=?",
    [Object.values(req.body), req.params.id],
    (err) => {
      if (err) {
        console.log(err.message);
        return res.status(500).json({ message: "An error occurred" });
      }
      return res.json({ message: "Product updated", product: req.body });
    }
  );
};
export const deleteMerch = (req, res) => {
  db.run("DELETE FROM products WHERE rowid=?", [req.params.id], (err) => {
    if (err) {
      console.log(err.message);
      return res.status(500).json({ message: "An error occurred" });
    }
    return res.json({ message: "Product deleted" });
  });
};

export const getOneMerch = (req, res) => {
  db.get("SELECT rowid, * FROM products WHERE rowid=?", [req.params.id], (err, row) => {
    if (err) {
      console.log(err.message);
      return res.status(500).json({ message: "An error occured" });
    }
    if (row) {
      const data = {
        ...row,
        ...parser(row),
      };
      db.all("SELECT rowid, * FROM products WHERE title=?", [data.title], (err, rows) => {
        if (err) {
          console.log(err.message);
          return res.status(500).json({ message: "An error occurred" });
        }
        const related = rows.map((row) => {
          return { ...row, ...parser(row) };
        });
        data.related = related.filter((item)=>item.rowid !== data.rowid);
        res.render("pages/detail.html", { data });
      });
    }
  });
};


export const getCategories = (req, res)=>{
  db.all("SELECT rowid, * FROM products WHERE title=?", [req.query.category], (err, rows)=>{
    if(err){
      console.log(err.message);
      return res.status(500).json({message: "An error occurred"})
    }
    if (rows){
      const products = rows.map((row)=>{
        return {...row, ...parser(row)}
      })
      res.render('pages/home.html', {products})
    }
  })

}
