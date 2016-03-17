var $USER_DATA = "http://localhost:3000/rest/users/Marcin";
var $SPRINT_DATA = "http://localhost:3000/rest/sprints/current/";
var $TASK_POST_DATA = "http://localhost:3000/rest/tasks";
var $STORY_PUT_DATA = "http://localhost:3000/rest/stories/";

function getUserData(handler){
  
	restQuery($USER_DATA, handler);
}

function getSprintData(projectId, handler){
	restQuery($SPRINT_DATA + projectId, handler);
}

function postTask(taskData, handler){

	postRest($TASK_POST_DATA, taskData, handler);
}

function updateTask(id, taskData, handler){

  putRest($TASK_POST_DATA + '/' + id, taskData, handler);
}

function updateStory(storyId, taskData, handler){

	putRest($STORY_PUT_DATA + storyId, taskData, handler);
}
function restQuery(url, handler){
	  $.getJSON(url,
	      function() {
	        console.log("request successfully sent");
	      })
	  .done(
	      function(data) {
	    	  handler(data);
     })
	  .fail(function() {
	    console.log("error");
	      });
	}

function postRest(url, restData, handler){

    $.ajax({
        url: url,
        type: 'POST',
        dataType: 'json',
        data: restData,
        success: function(result) {
          handler(result);
        }
    });
}

function putRest(url, restData, handler){

    $.ajax({
        url: url,
        type: 'PUT',
        dataType: 'json',
        data: restData,
        success: function(result) {
          if(handler != null){
        	handler(result);
          }
        }
    });
}