import {Component, ViewChild} from 'angular2/core';
import { Task } from './model/task';
import { Story } from './model/story';
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
  inputs: ['storyTitles'];
  directives: [MODAL_DIRECTIVES, FORM_DIRECTIVES],
  templateUrl: 'app/templates/task-editor.html',
})

export class TaskEditor {

	public storyTitles: string[];

    @ViewChild('modal')
    modal: ModalComponent;

	form: ControlGroup;
	title: Control;
	type: Control;
	priority: Control;
	assignee: Control;
	story: Control;
	estimate: Control;

    submitted = false;
    status = "";
    
    types: string[] = ['Bug', 'Enhancement', 'Story'];
    priorities: string[] = ['Low', 'Medium', 'High', 'Critical'];
	assignees: string[] = ['Marcin Wachowiak', 'Joe Doe'];

	constructor(
		private builder: FormBuilder,
        private _userService: UserService 
	) {
		
		this.title = new Control("", 
//			Validators.compose([Validators.required, UsernameValidator.startsWithNumber])
			Validators.required
		);
		this.type = new Control("", Validators.required);
		this.estimate = new Control("");
		this.priority = new Control("");
		this.assignee = new Control("");
		this.story = new Control("",
			Validators.compose([Validators.required])
		);
		this.clean();

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
       this.clean();
       this.status = null;
    }

    clean(){
		this.title.updateValue('');
		this.type.updateValue(this.types[0]);
		this.estimate.updateValue('');
		this.priority.updateValue('');
		this.assignee.updateValue('');
		this.story.updateValue(!this.storyTitles ? "Backlog" : this.storyTitles[0]);
    }
    
	submitData(){
		this.submitted = true;
		var value = this.form.value;
		delete value['story'];

     	this._userService.addTask(value)
     	.subscribe(
      data => {console.log(data); this.taskSent();},
      err => this.handleError(err),
      () => console.log('Update completed')
    );
     	
    }

	taskSent(){
	  this.submitted = false;
	  this.status = "Task successfully created";
	  this.clean();
	}
}
