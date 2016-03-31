import {Component, Input} from 'angular2/core';

@Component({
  selector: 'task-details',
  templateUrl: 'app/templates/task-details.html'
})

export class TaskDetails {

  hiddenDetails= true;

  @Input()
  task: Task;

  showDetails(){
    this.hiddenDetails = !this.hiddenDetails;
  }
}
