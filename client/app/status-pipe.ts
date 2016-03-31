import {Pipe, PipeTransform} from 'angular2/core';
import {Task} from './task';


@Pipe({name: 'statusFilter'})
export class StatusPipe implements PipeTransform{
transform(tasks:Task[], status) {
    return tasks.filter(task => task.status == status);
  }
}
