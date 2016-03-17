require('../models/product');
require('../models/sprint');
require('../models/counter');
require('../models/story');
require('../models/task');
require('../models/user');

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
Sprint = mongoose.model("Sprint");
Counter = mongoose.model("Counter");
Story = mongoose.model("Story");
Task = mongoose.model("Task");
User = mongoose.model("User");

mongoose.connection.collections['products'].drop(function(err) {
  console.log('products dropped');
  mongoose.connection.collections['sprints'].drop(function(err) {
    console.log('sprints dropped');
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
});

var product;

function saveProduct() {
  var productReq = new Product({
    code : 'TST',
    name : 'Test product',
    description : 'Test product',
  });

  productReq.save(function(err, productRes) {

    product = productRes;
    console.log('Product saved');
    saveCounter();
  });
}

function saveCounter() {

  var counter = new Counter({
    _id : 'taskid',
    seq : 1
  });
  counter.save(function(err, task) {
    console.log('Counter saved');
    saveStory();
  });

  function saveStory() {
    var story1 = new Story({
      product : product.id,
      title : 'First story',
    });
    story1.save(function(err, story) {
      console.log('Story saved');
      saveSprint(story.id);
    });
  }

  function saveSprint(storyId) {

    var sprint = new Sprint({
      product: product.id,
      startDate : '2016-03-01',
      endDate : '2016-03-31',
      stories: [storyId]
    });
        sprint.save(function(err, result) {

          product.sprints.push(result.id);
          product.save(function(err, result){
            saveTasks(storyId);
          });
    });
  }

  function saveTasks(storyId) {
    var task1 = new Task({
      story: storyId,
      title : "Lets improve something",
      status : "todo",
      type : "Enhancement",
      estimate : "5",
      created : "2015-04-04",
      priority : "Low",
      creator : "Marcin Wachowiak",
      assignee : "Wachowiak Marcin"
    });

    var task2 = new Task({
      story: storyId,
      title : "Something does not work",
      status : "inprogress",
      type : "Bug",
      estimate : "5",
      created : "2015-04-04",
      priority : "Low",
      creator : "Marcin Wachowiak",
      assignee : "Wachowiak Marcin"
    });

    task1.save(function(err, task) {
      console.log('Task1 saved');
      task2.save(function(err, task) {
        console.log('Task2 saved');
        saveUser();
      });
    });
  }

  function saveUser() {
    var user = new User({
      name : 'Marcin',
      surname : 'Wachowiak',
      products : [ product ]
    });
    user.save(function(err, user) {
      console.log('User saved');
      mongoose.connection.close();
    });
  }

}
