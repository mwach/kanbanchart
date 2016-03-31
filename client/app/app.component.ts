import {Component} from 'angular2/core';
import {HTTP_PROVIDERS}    from 'angular2/http';
import { RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS } from 'angular2/router';
import {KanbanBoardComponent} from './kanbanboard.component';
import {SurveyDemo} from './survey/survey-demo';
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
},
{
  path: '/form',
  name: 'Form',
  component: SurveyDemo
}
])

export class AppComponent{
}