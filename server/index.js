var mongoose = require('mongoose');
var taskSchema = require('./task');
var storySchema = require('./story');

console.log('init');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/jira');

console.log('connected');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {

	console.log('open');

	  var Task = mongoose.model('Task', taskSchema, 'tasks');
	  var Story = mongoose.model('Story', storySchema, 'stories');

//	  var t = new Task(
//              {
//                  "id": "4",
//					"title": "Some task #4",
//					"status": "todo",
//					"type" : "enhancement",
//					"estimate" : "5",
//					"created": "2015-04-04",
//					"priority": "LOW",
//					"creator": "Marcin Wachowiak",
//					"assignee": "Wachowiak Marcin"
//              }	  
//	  );
//	  t.save(function(err) {
//		  if (err) throw err;
//
//		  console.log('t saved successfully!');
//
//		  var s = new Story({
//			  title:'ABC title4', 
//			  tasks: [t]
//		  });
//		  s.save(function(err) {
//		  });
//			  if (err) throw err;

			  Story.find({'title': 'ABC title4'}).populate('story tasks').exec(
					  
					  function (err, docs) {	
					        if (err) console.error(err.stack||err);

					        console.log(docs[0]);
//					        mongoose.connection.db.dropDatabase(function () {
//					          mongoose.connection.close();
//					        })
				          mongoose.connection.close();
					 });
			  
			  console.log('s saved successfully!');
			});

//		});

//});