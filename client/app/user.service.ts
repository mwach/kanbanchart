import {Injectable} from 'angular2/core';

import {Task} from './task';
import {TASKS} from './mock-tasks';

@Injectable()
export class UserService {
  getTasks() {
    return Promise.resolve(TASKS);
  }
}
