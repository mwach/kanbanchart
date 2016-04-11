import { Component, OnInit, Injectable } from 'angular2/core';
import { Router } from 'angular2/router';

import { UserService } from './user.service';

import { Task } from './model/task';
import { Story } from './model/story';

import { TaskEditor } from './task-editor';

import { StatusPipe } from './status-pipe';

import { TaskDetails } from './task-details';

import {DragulaService, Dragula} from 'ng2-dragula';


@Component({
  templateUrl: 'app/templates/kanbanboard-form.html',
  pipes: [StatusPipe],
  directives: [TaskDetails, TaskEditor, Dragula],
  viewProviders: [DragulaService]
})


export class KanbanBoardComponent implements OnInit {

  stories: Story[] = [];
  story: Story;

  constructor(
    private _router: Router,
    private _userService: UserService, 
    private _dragulaService: DragulaService) {
    
    _dragulaService.drop.subscribe((value) => {
      this.onDrop(value);
    });
  };
 
  ngOnInit() {

      this._userService.getUser()
      .then(productId =>       this._userService.getStories(productId)
      .then(stories => { this.stories = stories; }));
  }


  private onDrop(args) {
    let [source_task, destination_task, destination_col, source_col] = args;

    this.stories.forEach((story: Story) => {
        story.tasks.forEach((task: Task) => {
          if (task.id == destination_task.id){
      	    task.status=destination_col.id;
      	    this._userService.updateTask(task);
          }
        });
    });
  }
}