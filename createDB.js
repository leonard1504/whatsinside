/*var MongoClient = require("mongodb").MongoClient;
var url = `mongodb+srv://admin:F1qqaFjnlNqvUYzH@cluster0.uvoew.mongodb.net/?retryWrites=true&w=majority`;

MongoClient.connect(url, function (err, db) {
  if (err) throw err;
  var dbo = db.db("dhbw");
  try {
  dbo.createCollection("foodandbeverages", function(err, res) {
    if (err) throw err;
    console.log("Collection created!");
    db.close();
  });
  } catch(e) {}*
  try {
    dbo.createCollection("customandtourism", function (err, res) {
      if (err) throw err;
      console.log("Collection created!");
      db.close();
    });
  } catch (e) {}
  try {
    dbo.createCollection("digital", function (err, res) {
      if (err) throw err;
      console.log("Collection created!");
      db.close();
    });
  } catch (e) {}
});*/
