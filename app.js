let express = require("express");
let app = express();
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const url = 'mongodb://localhost:27017/';
var util= require('util');
var encoder = new util.TextEncoder('utf-8');
var db, bookCollection;
MongoClient.connect(url, {useNewUrlParser: true}, function (err, client) {
  if (err) {
      console.log('Err  ', err);
  } else {
      console.log("Connected successfully to server");
      db = client.db('FIT2095');
      bookCollection = db.collection("books");


  }
});


let viewsPath = __dirname + "/views/";

app.use(express.urlencoded({ extended: true }));
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");
app.use(express.static("public/img"));
app.use(express.static("public/css"));

app.get("/", function (req, res) {
  console.log("Homepage request");
  let fileName = viewsPath + "index.html";
  res.sendFile(fileName);
});

app.get("/getaddbook", function (req, res) {
  let fileName = viewsPath + "addbook.html";
  res.sendFile(fileName);
});

app.get("/getallbooks", function (req, res) {
  bookCollection.find({}).toArray(function (err, result) {
    console.log(result);
    res.render("allbooks", {  
      books: result
  });
 
  });
});

app.post("/postnewbook", function (req, res) {
  console.log(req.body.date);
  let newBook = {
    title: req.body.title,
    author:req.body.author,
    topic:req.body.topic,
    date:req.body.date,
    summary:req.body.summary
  }
  bookCollection.insertOne(newBook);
  res.redirect("/getallbooks")
});

app.get("/deletebook", function (req, res) {
  res.render("deletebook");
});
app.get("/updatebook", function (req, res) {
  res.render("updatebook");
});
app.post("/postdeletebook", function (req, res) {
  let deleteBook = req.body.title;
  bookCollection.deleteMany({title:deleteBook},function(err,result){
    res.redirect("/getallbooks");
  });

});

app.post("/postupdatebook", function (req, res) {
  let existingBook = req.body.existingTitle;
  let updateBook = {
    title: req.body.title,
    author:req.body.author,
    topic:req.body.topic,
    date:req.body.date,
    summary:req.body.summary}
    bookCollection.updateMany({ title: existingBook }, {$set:updateBook },{upsert: false}, 
      function (err, result) {
        res.redirect("/getallbooks");
    });
  
}
);
app.listen(8080);
