var express = require('express');
var path = require('path');
var app = express();
var mongoose = require('mongoose');

mongoose.connect("mongodb://ys:dyrjxmtmanel@ds053206.mlab.com:53206/ysmongo");
var db = mongoose.connection;
db.once("open", function() {
  console.log("DB connected");
});
db.on("error", function(err) {
  console.log("DB ERROR: ", err);
});
/*
  in noSQL,
  Database: Collection 집합, 프로젝트 명
  Collection: SQL의 테이블 개념, 이름은 항상 복수형으로(Users, Posts)
  Document: SQL의 column, object나 array도 담을 수 있어서 유연하지만 복잡함
*/

//스키마, 자동으로 고유 id 생성됨
var dataSchema = mongoose.Schema({
  name: String,
  count: Number
});
// 모델을 담는 변수는 대문자로 시작
var Data = mongoose.model('data', dataSchema);
Data.findOne({name:"myData"}, function(err, data) {
  if(err) return console.log("Data ERROR: ", err);
  if(!data) {
    Data.create({name:"myData", count:0}, function(err, data) {
      if(err) return console.log("Data ERROR:", err);
      console.log("Counter initialized :", data);
    });
  }
});

/*
  mongoose.model()로 생성된 오브젝트로 사용하는 함수
    findOne(obj, callback 함수)
    find(obj, callback 함수)
    create(obj, callback 함수)
    findOneAndUpdate(obj1, obj2, callback 함수)
    findOneAndRemove(obj, callback 함수)
*/

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname + '/public')));

app.get('/', function (req, res) {
  Data.findOne({name:"myData"}, function(err, data) {
    if(err) return console.log("Data ERROR: ", err);
    data.count++;
    data.save(function (err) {
      if(err) return console.log("Data ERROR: ", err);
      res.render("index", data);
    });
  });
});

app.get('/reset', function (req, res) {
  setCounter(res, 0);
});

app.get('/set/count', function  (req, res) {
  if(req.query.count) data.count=req.query.count;
  else getCounter(res);
});

app.get('/set/:num', function (req, res) {
  if(req.params.num) setCounter(res, req.params.num);
  else getCounter(res);
});

function setCounter(res, num) {
  console.log("setCounter");
  Data.findOne({name:"myData"}, function(err, data){
    if(err) return console.log("Data ERROR: ", err);
    data.count=num;
    data.save(function(err) {
      if(err) return console.log("Data ERROR: ", err);
      res.render("index", data);
    });
  });
}

function getCounter(res) {
  console.log("getCounter");
  Data.findOne({name:"myData"}, function(err, data) {
    if(err) return console.log("Data ERROR: ", err);
    res.render("index", data);
  });
}

app.listen(3000, function() {
  console.log("SERVER ON!");
});
