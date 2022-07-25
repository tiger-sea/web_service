var express = require('express');
// const app = express();
var router = express.Router();
var sqlite3 = require('sqlite3');
var db = new sqlite3.Database('User.sqlite3');
const bcrypt = require('bcrypt'); // for encryption


// these variables are for sending info to front
var ids = [];
var names = [];
var ages = [];
console.log("\nindex.js is called\n"); // for debug

db.all('SELECT * FROM user', (err, rows) =>{
  console.log('db.all is called');
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
});

router
  /* GET home page. */
  .get('/', function(req, res, next) {
    res.render('index', {title: 'index'});
  })

  .get('/sample', function(req, res, next) {
    res.render('sample', {title:'sample', name: 'forger', age: '6つ'});
  })

  .get('/intro', function(req, res, next) {
    res.render('intro', {title: 'Introduction'});
  })

  .get('/all', function(req, res, next) {
    console.log(names, ages);
    res.render('all', {title: 'all', names: names, ages: ages, ids: ids});
  })

  .get('/angry', function(req, res, next) {
    res.render('angry', {title: 'Caution!!!'});
  })

  .get('/login', function(req, res, next) {
    res.render('login', { title: 'login'})
  })

  .post('/', function(req, res, next) {
    var name = req.body.name;
    var age = Number(req.body.age);
    var email = req.body.email;
    var password = req.body.password;
    var date = new Date();
    var createdtime = date.getFullYear()
    + '/' + ('0' + (date.getMonth() + 1)).slice(-2)
    + '/' + ('0' + date.getDate()).slice(-2)
    + ' ' + ('0' + date.getHours()).slice(-2)
    + ':' + ('0' + date.getMinutes()).slice(-2)
    + ':' + ('0' + date.getSeconds()).slice(-2)
    + '(JST)';
    
    if (name && age && email && password) {
      db.serialize(() => {
          db.run(
            'insert into user (name, age, email, password, createdtime) values (?, ?, ?, ?, ?)',
            name,
            age,
            email,
            bcrypt.hashSync(password, 10),  // for encryption
            createdtime
          );

          ids = [];
          names = [];
          ages = [];

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
      // inputs are null
      res.redirect('angry');
    }
  })

  .get('/test', function(req, res, next) {
    res.render('test', {title: 'Caution!!!'});
  })

  .post('/login', function(req, res, next) {
    db.serialize(() => {
      db.all('SELECT password FROM user', (err, rows) =>{
        if (err) {
            console.log(err);
            return;
        }
        flag = false
        rows.forEach((row) =>{ 
          console.log(req.body.password); // ログインするための入力
          console.log(row.password); // データベースの情報
          if(bcrypt.compareSync(req.body.password, row.password)) {
            a = bcrypt.compareSync(req.body.password, row.password);
            console.log(a)
            flag = true;
          }
        })
        if(flag) {
          res.render('test', { title: 'successfully loged in'})
        } else {
          res.render('test', {title: 'failed to log in'});
        }
      });
    });
  })

module.exports = router;

// .get('相手が行きたいURL?もらったURL?', function(req, res, next) {
//    res.render('うつしたいviewの名前')
// } 
