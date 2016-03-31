import {Component} from 'angular2/core';
import {HTTP_PROVIDERS}    from 'angular2/http';
import { RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS } from 'angular2/router';
import {KanbanBoardComponent} from './kanbanboard.component';
import {DragDropComponent} from './drag-drop.component';
import {UserService} from './user.service';

@Component({
	selector: 'kanban-board',
	template: `
        <router-outlet></router-outlet>
  	`,
	directives: [ROUTER_DIRECTIVES],
    providers: [
      ROUTER_PROVIDERS,
      HTTP_PROVIDERS,
      UserService,
    ]
})

@RouteConfig([
{
  path: '/kanbanboard',
  name: 'KanbanBoard',
  component: KanbanBoardComponent,
  useAsDefault: true
}
])

export class AppComponent{
}