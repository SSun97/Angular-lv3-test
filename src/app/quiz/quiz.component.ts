import {Component, inject, Input} from '@angular/core';
import {Question} from '../data.models';
import {QuizService} from '../quiz.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent {

  @Input()
  questions: Question[] | null = [];

  userAnswers: string[] = [];
  quizService = inject(QuizService);
  router = inject(Router);

  replaceQuestion(questions: Question[], oldQuestion: Question): void {
    // Find the index of the question to be replaced
    const index = questions.findIndex(q => q.question === oldQuestion.question);
    if (index !== -1) {
      this.quizService.getQuestion("10", "Easy").subscribe(res => {
          const newQuestions = res.map(q => ({
              ...q,
              all_answers: [...q.incorrect_answers, q.correct_answer]
          }));
  
          // Assuming you want to replace the old question with the first new question
          if (newQuestions.length > 0) {
              questions[index] = newQuestions[0];
          }
  
          // If you're working with a class property and want to ensure Angular detects the change
          this.questions = [...questions];
      });
  }}
  updateQuestions(questions: Question[], oldQuestion: Question): void {
    this.replaceQuestion(questions, oldQuestion);
    // this.questions = questions;
  }
  submit(): void {
    this.quizService.computeScore(this.questions ?? [], this.userAnswers);
    this.router.navigateByUrl("/result");
  }

}
