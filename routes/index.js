var express = require('express');
// const app = express();
var router = express.Router();

router
  /* GET home page. */
  .get('/', function(req, res, next) {
    res.render('index', {title: 'index'});
    // res.json({ message: "Hello World!" });
  })

  .get('/sample', function(req, res, next) {
    // res.send('This is sample');
    res.render('sample', {title:'default:sample', name: 'default:forger', age: 'default:6つ'});
  })

  .get('/fake', function(req, res, next) {
    res.render('fake', {title: 'fake'});
  })

  .post('/', function(req, res, next) {

    var name = req.body.name;
    var age = req.body.age;
  
    res.render('sample', {
      title: "結果！",
      name: name,
      age: age
    });
  
  });

  // .post('/', (req, res) => {
  //   res.send('POST request to the homepage')
  // })

module.exports = router;

// .get('行きたいURL?もらったURL?', function(req, res, next) {
//    res.render('うつしたいviewの名前')
// } 