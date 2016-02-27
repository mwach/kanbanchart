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
}

function showTaskDetails(taskId) {
	var $item = $('#task-hidden-' + taskId);
	var $currentStatus = $item.attr('class');
	if($currentStatus == 'task-details-visible'){
		$item.attr('class', 'task-details-hidden');
	}else{
		$item.attr('class', 'task-details-visible');
		
	}
	// $('#myModal').modal('show');

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

function parseProjectData($projectData) {

	var $storyIndex = 1;
	$.each($projectData.stories, function(i, story) {

		var $storyId = "story-" + $storyIndex;

		appendStoryTitle($storyId, story.title);
		appendStoryColumns($storyId, $storyIndex);

		$.each(story.tasks, function(i, task) {

			appendStoryTask(task, $storyIndex);

		});
		$storyIndex++;

	});

}

function appendStoryTitle(storyId, storyTitle) {
	$("<div>").attr("class", "row").attr("id", storyId).appendTo(".container");
	$("<div>").attr("class", "col-xs-12 story-definition").html(storyTitle)
			.appendTo("#" + storyId);
}

function appendStoryColumns(storyId, storyIndex) {
	var $storyList = storyId + "-list";

	$("<div>").attr("class", "row row-eq-height").attr("id", $storyList)
			.appendTo(".container");
	$("<div>").attr("class", "col-xs-3 tasks-column").attr("id",
			"tasks-todo-" + storyIndex).appendTo("#" + $storyList);
	$("<div>").attr("class", "col-xs-3 tasks-column").attr("id",
			"tasks-inprogress-" + storyIndex).appendTo("#" + $storyList);
	$("<div>").attr("class", "col-xs-3 tasks-column").attr("id",
			"tasks-toverify-" + storyIndex).appendTo("#" + $storyList);
	$("<div>").attr("class", "col-xs-3 tasks-column").attr("id",
			"tasks-done-" + storyIndex).appendTo("#" + $storyList);

}

function appendStoryTask(task, storyIndex) {
	var $taskParentId = '#tasks-' + task.status + '-' + storyIndex;

	var $taskLink = $('<a>').attr('href', '#').html('#' + task.id);
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
			.attr("onclick", "showTaskDetails(" + task.id + ");")
			.append($taskId)
			.append($title)
			.append($detailsHidden)
			.appendTo(
					$taskParentId).draggable({
				cursor : 'move',
				revert : true,
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