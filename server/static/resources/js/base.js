var sprintData;

function parseProjectData($data) {

  sprintData = $data;
  appentTitleToTaskCombo('null', 'Backlog');

  $.each(sprintData.stories, function(i, story) {

    appentTitleToTaskCombo(story.id, story.title);
    appendStoryTitle("story-", story.id, story.title);
    appendStoryColumns("story-", story.id, story.id);

    $.each(story.tasks, function(i, task) {

      appendStoryTask(task, story.id);

    });
  });

  setDroppableAccept();
}

function handleTaskDrop(event, ui) {
	var draggable = ui.draggable;
	draggable.appendTo($(this));
	draggable.position({
		of : $(this),
		my : 'middle bottom',
		at : 'middle bottom'
	});

	$(this).find('.ui-draggable').sort(function(a, b) {
		return parseInt(a.dataset.taskid) > parseInt(b.dataset.taskid);
	}).appendTo($(this));

  updateTaskStatus(draggable.attr('data-taskid'), $(this).attr('data-status'));
}

function showTaskDetails(taskId) {
	var $item = $('#task-hidden-' + taskId);
	var $currentStatus = $item.attr('class');
	if($currentStatus == 'task-details-visible'){
		$item.attr('class', 'task-details-hidden');
	}else{
		$item.attr('class', 'task-details-visible');
		
	}
}

function getObjects(obj, key, val) {
	var objects = [];
	for ( var i in obj) {
		if (!obj.hasOwnProperty(i))
			continue;
		if (typeof obj[i] == 'object') {
			objects = objects.concat(getObjects(obj[i], key, val));
		} else if (i == key && obj[key] == val) {
			objects.push(obj);
		}
	}
	return objects;
}


function appendStoryTitle(prefix, storyId, storyTitle) {
  
  $("<div>").attr("class", "row").attr("id", prefix+storyId).appendTo("#content");
	$("<div>").attr("class", "col-xs-12 story-definition").html(storyTitle)
			.appendTo("#" + prefix+storyId);
}

function appentTitleToTaskCombo(storyId, storyTitle) {
  var option = $('<option value="' + storyTitle + '">' + storyId + '</option>');
  $('#form-task-stories').append(option);
}

function appendStoryColumns(prefix, storyId, storyIndex) {
	var $storyList = prefix + storyId + "-list";

	$("<div>").attr("class", "row row-eq-height").attr("id", $storyList)
			.appendTo("#content");
	$("<div>").attr("class", "col-xs-3 tasks-column").attr("data-status", "todo").attr("id",
			"tasks-todo-" + storyIndex).appendTo("#" + $storyList);
	$("<div>").attr("class", "col-xs-3 tasks-column").attr("data-status", "inprogress").attr("id",
			"tasks-inprogress-" + storyIndex).appendTo("#" + $storyList);
	$("<div>").attr("class", "col-xs-3 tasks-column").attr("data-status", "toverify").attr("id",
			"tasks-toverify-" + storyIndex).appendTo("#" + $storyList);
	$("<div>").attr("class", "col-xs-3 tasks-column").attr("data-status", "done").attr("id",
			"tasks-done-" + storyIndex).appendTo("#" + $storyList);

}

function appendStoryTask(task, storyIndex) {

  var $taskParentId = '#tasks-' + task.status + '-' + storyIndex;

	var $taskLink = $('<a>').attr('href', '#').attr('id', task.id).html('#' + task.taskId);
	var $taskId = $('<p>').attr('class', 'task-title').append($taskLink);
	var $title = $('<p>').attr('class', 'task-estimate').html(task.title);

	var $details = $('<table>')
		.attr('class', 'table-responsive table-striped table-bordered table-small')
		.append($('<tr>').append($('<td>').html('Estimate')).append($('<td>').html(task.estimate)))
		.append($('<tr>').append($('<td>').html('Priority')).append($('<td>').html(task.priority)))
		.append($('<tr>').append($('<td>').html('Created')).append($('<td>').html(task.created)))
		.append($('<tr>').append($('<td>').html('Creator')).append($('<td>').html(task.creator)))
		.append($('<tr>').append($('<td>').html('Asignee')).append($('<td>').html(task.assignee)))
		;
	var $detailsHidden = $('<p>').attr('id', 'task-hidden-' + task.id).attr('class', 'task-details-hidden').append($details);

	$('<div>').attr("class", task.type)
			.attr('data-taskid', task.id).attr('id', 'taskid-' + task.id)
			.attr("onclick", "showTaskDetails('" + task.id + "');")
			.append($taskId)
			.append($title)
			.append($detailsHidden)
			.appendTo(
					$taskParentId).draggable({
				cursor : 'move',
				revert : true,
			});
	
	$('#' + task.id).click(function(e) {
	  editTask(task.id);
	   e.stopPropagation();
	});

}

function setDroppableAccept() {
	$('.tasks-column').droppable({
		hoverClass : 'hovered',
		drop : handleTaskDrop,
		accept : function(d) {
			current_id = d.parent().attr('id');
			suffix = current_id.slice(-1);
			return $(this).attr('id').endsWith(suffix);
		}
	});
}

$(document).ready(function () {
	initForm();
	
	$("#btn-task-close").click(clearTaskForm);
  $("#btn-new-task").click(createTask);

  $('#form-task').submit(submitNewTask);
});

function initForm(){
	cleanForm();
	getUserData(parseUserData);
}

function cleanForm(){
	$("#content").empty();
}

function parseUserData(data){
    getSprintData(data.products[0].id, parseProjectData);
}


function createTask(){
  $("#myModal").modal({backdrop: 'static',
    keyboard: true});
}

function editTask(id){

  var task = findTaskById(id);

  $('#form-div-task-id').attr('class', 'form-group task-details-visible');
  $('#form-task-id').val(task.taskId);
  $('#form-task-title').val(task.title);
  $('#form-task-type').val(task.type);
  $('#form-task-estimate').val(task.estimate);
  $('#form-task-priority').val(task.priority);
  $('#form-task-assignee').val(task.assignee);
  $('#form-task-story').val(sprintData.stories[0].title);

  $("#myModal").modal({backdrop: 'static',
    keyboard: true});
}

function submitNewTask(){

  task = {
      'title': $('#form-task-title').val(),
      'status': 'todo',
      'type': $('#form-task-type').val(),
      'estimate': $('#form-task-estimate').val(),
      'priority': $('#form-task-priority').val(),
      'assignee': $('#form-task-assignee').val(),
      'story': getSelectedOptionId($("#form-task-story"), $("#form-task-stories option"))
  };
  taskId = $('#form-task-id').val();
  //update of existing task
  if(taskId){
    editedTask = findTaskByTaskId(taskId);
    task.status = editedTask.status;
    updateTask(editedTask.id, JSON.stringify(task), handleUpdatedTask);
  }else{
    //new task
    postTask(JSON.stringify(task), handleCreatedTask);
  }

  return false;
}

function updateTaskStatus(id, status){

  editedTask = findTaskById(id);
  task = {
      'title': editedTask.title,
      'status': status,
      'type': editedTask.type,
      'estimate': editedTask.estimate,
      'priority': editedTask.priority,
      'assignee': editedTask.assignee,
      'story': editedTask.story
  };
  updateTask(editedTask.id, JSON.stringify(task), null);
}

function findTaskById(id){
  var task = undefined;
  $.grep(sprintData.stories, function(story){ 

    tasks = $.grep(story.tasks, function(t){ 
      if(t.id == id){
        task = t;
      }
    });
  });
  return task;
}

function findTaskByTaskId(taskId){
  var task = undefined;
  $.grep(sprintData.stories, function(story){ 

    tasks = $.grep(story.tasks, function(t){ 
      if(t.taskId == taskId){
        task = t;
      }
    });
  });
  return task;
}

function clearTaskForm(){
  $('#form-div-task-id').attr('class', 'form-group task-details-hidden');
  $('#dialog-task-notifier').html('');
  $('#form-task-id').val("");
  $('#form-task-title').val("");
  $('#form-task-type').val("");
  $('#form-task-estimate').val("");
  $('#form-task-priority').val("");
  $('#form-task-assignee').val("");
  $('#form-task-story').val("");
}

function getSelectedOptionId(element, options){

    var selectedValue = element.val();
    var optionId;
    var value;
    
    options.each(function(index) {
    	var val = $(this).val();

      if(val === selectedValue){
    	  value = $(this).text();
      }
  });
    return value;
}

function handleUpdatedTask(response) {
  initForm();
  showTaskNotification("Task successfully updated");
}

function handleCreatedTask(response) {
  initForm();
  showTaskNotification("Task successfully created");

  var taskId = response.id;
  clearTaskForm();
};

function showTaskNotification(message){
  
  $("#dialog-task-notifier").append($("<div class='alert alert-success'><a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a><strong>Success! </strong> " + message + "</div>"));
}