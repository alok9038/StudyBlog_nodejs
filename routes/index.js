var express = require('express');
var router = express.Router();
var connection = require('../database')
// var async = require('async')
/* GET home page. */
router.get('/', function(req, res, next) {
  let sql = "SELECT posts.*, topics.title as topic_title, topics.color FROM posts join topics on posts.topic_id = topics.id;";

  let query = connection.query(sql,function(err,result){
  if(err) throw err;
    res.render('index', { "posts":result });
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

router.post('/insert-post',function(req, res, next){
  let sql = "Insert into posts(title, topic_id, author, content) values(?, ?, ?, ?)";
  let query = connection.query(sql,[req.body.post_title, req.body.topic_id, req.body.author, req.body.content], function(err, result){
    if(err) throw err;
    
    // req.flash('success','Inserted New Record Successfully')
    res.redirect('/insert-post');
    console.log("Post successfully Inserted");
  });

})

module.exports = router;
