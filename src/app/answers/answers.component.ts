import {Component, Input, inject} from '@angular/core';
import {Results} from '../data.models';
import { ButtonStateService } from '../button-state.service';

@Component({
  selector: 'app-answers',
  templateUrl: './answers.component.html',
  styleUrls: ['./answers.component.css']
})
export class AnswersComponent {

  @Input()
  data!: Results;
  btnStateService = inject(ButtonStateService);
  refreshBtnState(): void {
    this.btnStateService.refreshChangeButton();
  }
}
