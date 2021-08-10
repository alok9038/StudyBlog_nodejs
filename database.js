var mysql = require('mysql')

const connection = mysql.createConnection({
    host:"localhost",
    user: "root",
    password:"",
    database:"study_blog",
    multipleStatements: true
});

connection.connect(function(err){
  if(err){
    console.log(err)
  }
  else{
    console.log("connected");
  }
})


module.exports = connection