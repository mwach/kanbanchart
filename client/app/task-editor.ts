import {Component, ViewChild} from 'angular2/core';
import { Task } from './model/task';
import { MODAL_DIRECTIVES, ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { UserService } from './user.service';

import {FormBuilder, Validators, Control, ControlGroup, FORM_DIRECTIVES} from 'angular2/common';

interface ValidationResult{
   [key:string]:boolean;
}

export class UsernameValidator {

    static startsWithNumber(control: Control): ValidationResult { 
    
      if ( control.value !="" && !isNaN(control.value.charAt(0)) ){
        return {"startsWithNumber": true};
      }
    
      return null;
    }
}

@Component({
  selector: 'task-editor',
  directives: [MODAL_DIRECTIVES, FORM_DIRECTIVES],
  templateUrl: 'app/templates/task-editor.html',
})

export class TaskEditor {
    @ViewChild('modal')
    modal: ModalComponent;

	form: ControlGroup;
	title: Control;
	type: Control;
	priority: Control;
	assignee: Control;
	story: Control;
	estimate: Control;

    types: string[] = ['Bug', 'Enhancement', 'Story'];
    priorities: string[] = ['Low', 'Medium', 'High', 'Critical'];
	assignees: string[] = ['Marcin Wachowiak', 'Joe Doe'];
	stories: string[] = ['Backlog', 'Story A'];

	constructor(
		private builder: FormBuilder,
        private _userService: UserService 
	) {
		
		this.title = new Control("", 
//			Validators.compose([Validators.required, UsernameValidator.startsWithNumber])
			Validators.required
		);
		this.type = new Control(this.types[0], Validators.required);
		this.estimate = new Control("");
		this.priority = new Control("");
		this.assignee = new Control("");
		this.story = new Control(this.stories[0],
			Validators.compose([Validators.required])
		);

		this.form = builder.group({
			title:  this.title,
			type:  this.type,
			estimate: this.estimate
			priority: this.priority,
			assignee: this.assignee,
			story: this.story,
		});
	}	

    close() {
        this.modal.close();
    }

    open() {
       this.modal.open();
    }

	submitData(){
		var value = this.form.value;
		delete value['story'];
     	this._userService.addTask(value);
    }

}
