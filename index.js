const express = require("express");
const QRCode = require("qrcode");
var bodyParser = require("body-parser");
const { type } = require("express/lib/response");
var MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
let url = `mongodb+srv://admin:F1qqaFjnlNqvUYzH@cluster0.uvoew.mongodb.net/?retryWrites=true&w=majority`;

require("dotenv").config();

console.log(process.env);

const app = express();
const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Server listening at port ${port}`));
app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }));
app.use(express.static("./"));
app.use(express.json({ limit: "100mb", extended: true }));

let product = {};
app.post("/add", function (req, res) {
  MongoClient.connect(url, async function (err, db) {
    if (err) throw err;
    var dbo = db.db("dhbw");
    //console.log(req.body);
    product = {
      name: req.body.name,
      manu: req.body.manu,
      desc: req.body.desc,
      type: req.body.type,
      land: req.body.land,
      img: req.body.img,
    };
    dbo.collection(`${req.body.type}`).insertOne(product, function (err, res) {
      if (err) throw err;
      console.log(
        `Added Entry ๐งพ \n ID: ${product._id} \n Name: ${product.name} \n Description: ${product.desc} \n Type: ${product.type}`
      );
      let db_product = {
        id: product._id,
        type: product.type,
      };
      productData = JSON.stringify(db_product);
      QRCode.toDataURL(productData, function (error, url) {
        if (error) console.error(error);
        console.log("Successfully created QR Code โ");
        app.post("/getqrcode", function (req, res) {
          res.json(url);
        });
      });
      db.close();
    });
  });
});

app.post("/qrscan", async function (req, res) {
  let scan = `${req.body.element}`;
  let product = JSON.parse(scan);
  console.log(
    `Scanned QR Code โ \n ID: ${product.id} \n Type: ${product.type}`
  );
  MongoClient.connect(url, async function (err, db) {
    if (err) throw err;
    var dbo = db.db("dhbw");
    let result = await dbo
      .collection(`${product.type}`)
      .find({ _id: ObjectId(`${product.id}`) })
      .toArray();
    console.log(
      `Got entry from database โ \n Name: ${result[0].name} \n Description: ${result[0].desc} \n Type: ${result[0].type}`
    );
    let dbinfo = {
      name: result[0].name,
      manu: result[0].manu,
      desc: result[0].desc,
      type: result[0].type,
      land: result[0].land,
      img: result[0].img
    }
    app.post("/getdbinfo", function (req, res) {
      res.json(JSON.stringify(dbinfo));
    });
    db.close();
  });
});
