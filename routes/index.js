var express = require('express');
var router = express.Router();
var connection = require('../database')
var  multer = require('multer');
// var async = require('async')
/* GET home page. */
var path = require('path');

// image uploading
var storage = multer.diskStorage({
  destination:function(req, file, cb){
    cb(null,"./public/images");
  },
  filename:function(req, file, cb){
    cb(null,file.fieldname + "_" + Date.now() + path.extname(file.originalname))

  }
})

var upload = multer({storage:storage})


router.get('/', function(req, res, next) {
  let sql = "SELECT posts.*, topics.title as topic_title, topics.color FROM posts join topics on posts.topic_id = topics.id;select * from topics";

  let query = connection.query(sql,function(err,result){
  if(err) throw err;
    res.render('index', { "posts":result[0], "topics":result[1] });
  })
});

// category filteration
router.get('/category/:id', function(req, res, next) {
  let sql = "SELECT posts.*, topics.title as topic_title, topics.color FROM posts join topics on posts.topic_id = topics.id where posts.topic_id = ?;select * from topics;";

  let query = connection.query(sql,[req.params.id],function(err,result){
  if(err) throw err;
    res.render('index', { "posts":result[0], "topics":result[1], "featured":true });
  })
});

router.get('/insert-topic', function(req, res, next) {
  let sql = "select * from topics";
  let query = connection.query(sql,function(err,result){
    if(err) throw err;

    res.render('insert',{ "result":result });
  })
});

router.post('/insert-topic',function(req, res, next){
  let sql = "Insert into topics(title, color) values(?, ?)";
  let query = connection.query(sql,[req.body.topic_title, req.body.color], function(err, result){
    if(err) throw err;
    
    // req.flash('success','Inserted New Record Successfully')
    res.redirect('/insert-topic');
    console.log("Inserted");
  });

})

router.get('/insert-post', function(req, res, next) {
  let sql = "select * from topics; SELECT posts.*, topics.title as topic_title FROM posts join topics on posts.topic_id = topics.id;";
  // let sql2 = "SELECT * FROM posts;";
  let query = connection.query(sql,function(err,result){
    if(err) throw err;

    // console.log(result[0]);
    res.render('insert_post',{ "result":result[0], "posts":result[1] });
  })
});

router.post('/insert-post',upload.single('image'),function(req, res, next){
  let sql = "Insert into posts(title, topic_id, author, content, image) values(?, ?, ?, ?,?)";
  let query = connection.query(sql,[req.body.post_title, req.body.topic_id, req.body.author, req.body.content, req.file.filename], function(err, result){
    if(err) throw err;
    
    // req.flash('success','Inserted New Record Successfully')
    res.redirect('/insert-post');
    console.log("Post successfully Inserted");
  });

})


// post view



router.get('/post/:id', function(req, res, next) {
  let sql = "SELECT posts.*, topics.title as topic_title, topics.color FROM posts join topics on posts.topic_id = topics.id where posts.id = ?; SELECT posts.*, topics.title as topic_title, topics.color FROM posts join topics on posts.topic_id = topics.id where posts.id != ?";

  let query = connection.query(sql,[req.params.id, req.params.id],function(err,result){
  if(err) throw err;
    res.render('post',{post:result[0][0], relateds:result[1]});
  })
});

module.exports = router;
