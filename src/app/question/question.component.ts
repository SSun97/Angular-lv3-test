import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Question} from '../data.models';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent {

  @Input({required: true})
  question!: Question;
  @Input()
  correctAnswer?: string;
  @Input()
  userAnswer?: string;

  getButtonClass(answer: string): string {
    if (! this.userAnswer) {
        if (this.currentSelection == answer)
          return "tertiary";
    } else {
      if (this.userAnswer == this.correctAnswer && this.userAnswer == answer)
        return "tertiary";
      if (answer == this.correctAnswer)
        return "secondary";
    }
    return "primary";
  }

  @Output()
  qChange = new EventEmitter<string>();
  @Output()
  changeQuestion = new EventEmitter<Question>();
  currentSelection!: string;

  buttonClicked(answer: string): void {
    this.currentSelection = answer;
    this.qChange.emit(answer);
  }
  onChangeBtnClick(question: Question): void{
    this.changeQuestion.emit(question);
  }

}
