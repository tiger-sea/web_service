var express = require('express');
// const app = express();
var router = express.Router();
var sqlite3 = require('sqlite3');
var db = new sqlite3.Database('test.sqlite3');

var ids = [];
var names = [];
var ages = [];
console.log("called");

db.all('SELECT * FROM user', (err, rows) =>{
  console.log('db.all')
  if (err) {
      console.log(err);
      return;
  }
  rows.forEach((row) =>{
    ids.push(row.id);
    names.push(row.name);
    ages.push(row.age);
    // console.log('id:' + row.id + ' name:' + row.name + ' age:' + row.age);
  })
  // console.log(ids);
  // console.log(names);
  // console.log(ages);
});

router
  /* GET home page. */
  .get('/', function(req, res, next) {
    console.log('get /');
    res.render('index', {title: 'index'});
    // res.json({ message: "Hello World!" });
  })

  .get('/sample', function(req, res, next) {
    console.log('get /sample')
    res.render('sample', {title:'sample', name: 'forger', age: '6つ'});
  })

  .get('/intro', function(req, res, next) {
    console.log('get /intro')
    res.render('intro', {title: 'Introduction'});
  })

  .get('/all', function(req, res, next) {
    // db.all("select * from user", (error, rows) =>{
    //   // rows.forEach(row => console.log(row.name));
    //   rows.forEach(row => names= row.name);
    // });
    console.log(names, ages);
    res.render('all', {title: 'all', names: names, ages: ages, ids: ids});
  })

  .get('/angry', function(req, res, next) {
    console.log('angry')
    res.render('angry', {title: 'Caution!!!'});
  })

  .post('/', function(req, res, next) {
    var name = req.body.name;
    var age = Number(req.body.age);
    var date = new Date();
    var createdtime = date.getFullYear()
    + '/' + ('0' + (date.getMonth() + 1)).slice(-2)
    + '/' + ('0' + date.getDate()).slice(-2)
    + ' ' + ('0' + date.getHours()).slice(-2)
    + ':' + ('0' + date.getMinutes()).slice(-2)
    + ':' + ('0' + date.getSeconds()).slice(-2)
    + '(JST)';
    
    console.log(typeof(name), typeof(age));
    if (name && age) {
      // do something
      db.serialize(() => {
          db.run(
            'insert into user (name, age, createdtime) values (?, ?, ?)',
            name,
            age,
            createdtime
          );

          ids = [];
          names = [];
          ages = [];
          console.log("called");

          db.all('SELECT * FROM user', (err, rows) =>{
            console.log('db.all')
            if (err) {
                console.log(err);
                return;
            }
            rows.forEach((row) =>{
              ids.push(row.id);
              names.push(row.name);
              ages.push(row.age);
            })
          });

      
          res.render('sample', {
            title: "Sample page",
            name: name,
            age: age,
          });
        });
    } else {
      res.redirect('angry');
    }
  })

  .get('/test', function(req, res, next) {
    console.log('test')
    res.render('test', {title: 'Caution!!!'});
  })

module.exports = router;

// .get('相手が行きたいURL?もらったURL?', function(req, res, next) {
//    res.render('うつしたいviewの名前')
// } 
