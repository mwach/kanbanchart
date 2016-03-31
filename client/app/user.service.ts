import {Injectable} from 'angular2/core';
import {Task} from './task';
import {Http, Response} from 'angular2/http';
import 'rxjs/Rx';

import {TASKS} from './mock-tasks';

@Injectable()
export class UserService {

  private _tasksUrl = 'http://localhost:3000/rest/sprints/current/56e954afdb2a7f35144999d9';  // URL to web api



  constructor (private http: Http) {}



  getTasks() {
  console.log('TASKS');
    //return Promise.resolve(TASKS);
    return this.http.get(this._tasksUrl).toPromise()
                  .then(res => <Task[]> res.json().stories[0].tasks, this.handleError)
                  .then(data => { console.log(data); return data; });
  }

private handleError (error: any) {
  console.error(error);
  return Promise.reject(error.message || error.json().error || 'Server error');
}

}
