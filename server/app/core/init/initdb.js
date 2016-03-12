require('../models/product');
require('../models/counter');
require('../models/story');
require('../models/task');
require('../models/user');

process.env.NODE_ENV = 'production';

var Config = require('../core/config');
cfg = new Config();
console.log('Using ' + cfg.mongo_url);

var mongoose = require('mongoose');
mongoose.connect(cfg.mongo_url, {
  server : {
    auto_reconnect : true
  }
});

Product = mongoose.model("Product");
Counter = mongoose.model("Counter");
Story = mongoose.model("Story");
Task = mongoose.model("Task");
User = mongoose.model("User");

mongoose.connection.collections['products'].drop(function(err) {
  console.log('products dropped');
  mongoose.connection.collections['stories'].drop(function(err) {
    console.log('stories dropped');
    mongoose.connection.collections['tasks'].drop(function(err) {
      console.log('tasks dropped');
      mongoose.connection.collections['counters'].drop(function(err) {
        console.log('counters dropped');
        mongoose.connection.collections['users'].drop(function(err) {
          console.log('users dropped');
          saveProduct();
        });
      });
    });
  });
});

var product;

function saveProduct() {
  var productReq = new Product({
    code : 'TST',
    name : 'Test product',
    description : 'Test product',
    sprints : [ {
      startDate : '2016-03-01',
      endDate : '2016-03-31'
    } ]
  });

  productReq.save(function(err, productRes) {

    product = productRes;
    console.log('Product saved');
    productId = product.id;
    sprintId = product.sprints[0].id;
    saveCounter(productId, sprintId);
  });

}

function saveCounter(productId, sprintId) {

  var counter = new Counter({
    _id : 'taskid',
    seq : 1
  });
  counter.save(function(err, task) {
    console.log('Counter saved');
    saveTasks();
  });

  function saveTasks() {
    var task1 = new Task({
      title : "Something does not work",
      status : "inprogress",
      type : "bug",
      estimate : "5",
      created : "2015-04-04",
      priority : "LOW",
      creator : "Marcin Wachowiak",
      assignee : "Wachowiak Marcin"
    });

    var task2 = new Task({
      title : "Something does not work",
      status : "inprogress",
      type : "bug",
      estimate : "5",
      created : "2015-04-04",
      priority : "LOW",
      creator : "Marcin Wachowiak",
      assignee : "Wachowiak Marcin"
    });

    task1.save(function(err, task) {
      console.log('Task1 saved');
      task2.save(function(err, task) {
        console.log('Task2 saved');
        saveStory(task1, task2);
      });
    });
  }

  function saveStory(task1, task2) {
    var story1 = new Story({
      sprint : sprintId,
      product : productId,
      title : 'First story',
      tasks : [ task1, task2 ]
    });
    story1.save(function(err, story) {
      console.log('Story saved');
      saveUser();
    });
  }

  function saveUser() {
    var user = new User({
      name : 'Marcin',
      surname : 'Wachowiak',
      products : [product]
    });
    user.save(function(err, user) {
      console.log('User saved');
      mongoose.connection.close();
    });
  }
}
