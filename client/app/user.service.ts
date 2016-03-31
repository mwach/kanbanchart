import {Injectable} from 'angular2/core';
import {Task} from './task';
import {Http, Response} from 'angular2/http';
import 'rxjs/Rx';

@Injectable()
export class UserService {

  private _tasksUrl = 'http://localhost:3000/rest/sprints/current/56e954afdb2a7f35144999d9';  // URL to web api
  private _tasks = 'http://localhost:3000/rest/tasks/';  // URL to web api

  constructor (private _http: Http) {}

  getTasks() {
    return this._http.get(this._tasksUrl).toPromise()
                  .then(res => <Task[]> res.json().stories[0].tasks, this.handleError)
                  .then(data => { console.log(data); return data; });
  }

  updateTask(task: Task) {
    console.log('updating task');
    this._http.put(this._tasks + task.id, JSON.stringify(task))
    .map(res => res.json())
    .subscribe(
      data => console.log(data),
      err => this.handleError(err),
      () => console.log('Authentication Complete')
    );
  }


private handleError (error: any) {
  console.error(error);
  return Promise.reject(error.message || error.json().error || 'Server error');
}

}
