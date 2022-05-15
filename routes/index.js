var express = require('express');
// const app = express();
var router = express.Router();
var sqlite3 = require('sqlite3');
var db = new sqlite3.Database('test.sqlite3');

router
  /* GET home page. */
  .get('/', function(req, res, next) {
    res.render('index', {title: 'index'});
    // res.json({ message: "Hello World!" });
  })

  .get('/sample', function(req, res, next) {
    // res.send('This is sample');
    res.render('sample', {title:'sample', name: 'forger', age: '6つ'});
  })

  .get('/intro', function(req, res, next) {
    res.render('intro', {title: 'Introduction'});
  })

  .get('/all', function(req, res, next) {
    // db.all("select * from user", (error, rows) =>{
    //   // rows.forEach(row => console.log(row.name));
    //   rows.forEach(row => names= row.name);
    // });
    var names = [];
    var ages = [];
    db.each("select * from user", (error, row) =>{
      console.log(row.name, row.age);
      names = row.name;
      ages = row.age;
    })
    res.render('all', {title: 'all', names: names, ages: ages});
  })

  .get('/angry', function(req, res, next) {
    res.render('angry', {title: 'Caution!!!'});
  })

  .post('/', function(req, res, next) {

    var name = req.body.name;
    var age = req.body.age;
    var date = new Date();
    var createdtime = date.getFullYear()
    + '/' + ('0' + (date.getMonth() + 1)).slice(-2)
    + '/' + ('0' + date.getDate()).slice(-2)
    + ' ' + ('0' + date.getHours()).slice(-2)
    + ':' + ('0' + date.getMinutes()).slice(-2)
    + ':' + ('0' + date.getSeconds()).slice(-2)
    + '(JST)';
    
    if (name && age) {
      // do something
      db.serialize(() => {
        // db.run("drop table if exists members");
        // db.run("create table if not exists user(id primary key autoincrement, name text, age integer)");
    
          db.run(
            'insert into user (name, age, createdtime) values (?, ?, ?)',
            name,
            age,
            createdtime
          );
      
          res.render('sample', {
            title: "Sample page",
            name: name,
            age: age,
            data: db.all
          });
        });
    } else {
      // res.render('angry', {title: 'Caution!!!'});
      res.redirect('angry');
    }

  });

  // db.close();

module.exports = router;

// .get('相手が行きたいURL?もらったURL?', function(req, res, next) {
//    res.render('うつしたいviewの名前')
// } 
