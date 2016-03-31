import { Component, OnInit, Injectable } from 'angular2/core';
import { Router } from 'angular2/router';

import { UserService } from './user.service';

import { Task } from './model/task';
import { StatusPipe } from './status-pipe';

import { TaskDetails } from './task-details';

import {DragulaService, Dragula} from 'ng2-dragula';


@Component({
  templateUrl: 'app/templates/kanbanboard-form.html',
  pipes: [StatusPipe],
  directives: [TaskDetails, Dragula],
  viewProviders: [DragulaService]
})


export class KanbanBoardComponent implements OnInit {

  tasks: Task[] = [];

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
      .then(productId =>       this._userService.getTasks(productId)
      .then(tasks => this.tasks = tasks));
  }


  private onDrop(args) {
    let [source_task, destination_task, destination_col, source_col] = args;
    
    this.tasks.forEach((task: Task) => {
      if (task.id == destination_task.id){
      	task.status=destination_col.id;
      	this._userService.updateTask(task);
      }
    });
    
    
  }
}