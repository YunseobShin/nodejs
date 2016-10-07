var express = require('express');
var path = require('path');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
// 메소드 오버라이드 하는 이유: 브라우저가 get,post 이외는 차단함
var methodOverride = require('method-override');

mongoose.connect("mongodb://@ds053206.mlab.com:53206/ysmongo");
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
/*
  mongoose.model()로 생성된 오브젝트로 사용하는 함수
    findOne(obj, callback 함수)
    find(obj, callback 함수)
    create(obj, callback 함수)
    findOneAndUpdate(obj1, obj2, callback 함수)
    findOneAndRemove(obj, callback 함수)
*/

// model setting
var postSchema = mongoose.Schema({
  title: {type:String, required:true},
  body: {type:String, required:true},
  createdAt: {type:Date, default:Date.now},
  updatedAt: Date
});
var Post = mongoose.model('post', postSchema);

// view setting
app.set("view engine", "ejs");

// set middlewares
app.use(express.static(path.join(__dirname + '/public')));
app.use(bodyParser.json()); // json을 전송하는 경우
app.use(bodyParser.urlencoded({extented:true}));  // 웹사이트가 json으로 데이터를 전송할 경우
app.use(methodOverride("_method"));

// set routes
app.get('/posts', function(req, res) {
  Post.find({}).sort('-createdAt').exec(function(err, posts) {
    if(err) return res.json({success:false, message:err});
    res.render("posts/index", {data:posts});
  });
}); // index
app.get('/posts/new', function(req, res) {
  res.render("posts/new");
}); // new
app.post('/posts', function(req, res) {
  Post.create(req.body.post, function(err, post) {
    if(err) return res.json({success:false, message:err});
    res.redirect("/posts");
  });
}); // creaete
app.get('/posts/:id', function(req, res) {
  Post.findById(req.params.id, function(err, post) {
    if(err) return res.json({success:false, message:err});
    res.render("posts/show", {data:post});
  });
}); // show
app.get('/posts/:id/edit', function(req, res) {
  Post.findById(req.params.id, function(err, post) {
    if(err) return res.json({success:false, message:err});
    res.render("posts/edit", {data:post});
  });
}); //edit
app.put('/posts/:id', function(req, res) {
  req.body.post.updatedAt=Date.now();
  Post.findByIdAndUpdate(req.params.id, req.body.post, function(err, post) {
    if(err) return res.json({success:false, message:err});
    res.redirect("/posts/"+req.params.id);
  });
}); // update
app.delete('/posts/:id', function(req, res) {
  Post.findByIdAndRemove(req.params.id, function(err, post) {
    if(err) return res.json({success:false, message:err});
    res.redirect("/posts");
  });
}); //destroy


// start server
app.listen(3000, function() {
  console.log("SERVER ON!");
});
