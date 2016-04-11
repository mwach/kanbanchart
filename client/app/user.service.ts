import {Injectable} from 'angular2/core';
import {Task} from './model/task';
import {Story} from './model/stories';
import {User} from './model/user';
import {Http, Response} from 'angular2/http';
import 'rxjs/Rx';

@Injectable()
export class UserService {

  private _userUrl = 'http://localhost:3000/rest/users/Marcin';  // URL to web api

  private _tasksUrl = 'http://localhost:3000/rest/sprints/current/';  // URL to web api
  private _tasks = 'http://localhost:3000/rest/tasks';  // URL to web api

  constructor (private _http: Http) {}

  getUser() {
    return this._http.get(this._userUrl).toPromise()
                  .then(res => <User> res.json().products[0].id, this.handleError)
                  .then(data => {return data;} );
  }

  getStories(productId) {
      return this._http.get(this._tasksUrl + productId).toPromise()
                  .then(res => <Story[]> res.json().stories, this.handleError)
                  .then(data => {return data;} );
  }

  updateTask(task: Task) {
    this._http.put(this._tasks + '/' + task.id, JSON.stringify(task))
    .map(res => res.json())
    .subscribe(
      data => console.log(data),
      err => this.handleError(err),
      () => console.log('Update completed')
    );
  }

  addTask(task: Task) {
    return this._http.post(this._tasks, JSON.stringify(task))
    .map(res => res.json());
  }


private handleError (error: any) {
  console.error(error);
//  return Promise.reject(error.message || error.json().error || 'Server error');
}

}
