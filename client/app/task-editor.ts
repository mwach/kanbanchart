import {Component, ViewChild} from 'angular2/core';
import { MODAL_DIRECTIVES, ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';

import {FormBuilder, Validators, Control, ControlGroup, FORM_DIRECTIVES} from 'angular2/common';

interface ValidationResult{
   [key:string]:boolean;
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
	stories: string[] = ['Story A', 'Backlog'];

	constructor(private builder: FormBuilder) {
		
		this.title = new Control(
			"", 
			Validators.compose([Validators.required])
		);
		this.type = new Control(
			"", 
			Validators.compose([Validators.required])
		);
		this.priority = new Control("");
		this.assignee = new Control("");
		this.story = new Control("");
		this.estimate = new Control("");
		
		this.form = builder.group({
			title:  this.title,
			type:  this.type,
			priority: this.priority,
			assignee: this.assignee,
			story: this.story,
			estimate: this.estimate
		});
	}	

    close() {
        this.modal.close();
    }

    open() {
       console.log(this.modal);
       this.modal.open();
    }

	submitData(){
     	console.log(JSON.stringify(this.form.value))
    }

}
