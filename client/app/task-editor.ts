import {Component, ViewChild} from 'angular2/core';
import { MODAL_DIRECTIVES, ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';

@Component({
  selector: 'task-editor',
  directives: [MODAL_DIRECTIVES],
  templateUrl: 'app/templates/task-editor.html'
})

export class TaskEditor {
    @ViewChild('modal')
    modal: ModalComponent;

    close() {
        this.modal.close();
    }

    open() {
       console.log(this.modal);
       this.modal.open();
    }
}
