import {Component, inject, Input} from '@angular/core';
import {Difficulty, Question} from '../data.models';
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
  @Input() categoryId: string | null = "";
  @Input() difficulty: Difficulty | null = null;
  userAnswers: string[] = [];
  quizService = inject(QuizService);
  router = inject(Router);

  replaceQuestion(questions: Question[], oldQuestion: Question): void {
    // Find the index of the question to be replaced
    const index = questions.findIndex(q => q.question === oldQuestion.question);
    const quizData = JSON.parse(localStorage.getItem('quizData') ?? '{}');
    const categoryId = quizData.selectedValue.split(',')[0];
    const difficulty: Difficulty = quizData.difficulty;
    if (index !== -1) {
      this.quizService.getQuestion(categoryId, difficulty).subscribe(res => {
          const newQuestions = res.map(q => ({
              ...q,
              all_answers: [...q.incorrect_answers, q.correct_answer]
          }));
  
          if (newQuestions.length > 0) {
              questions[index] = newQuestions[0];
          }
  
          this.questions = [...questions];
      });
  }}
  updateQuestions(questions: Question[], oldQuestion: Question): void {
    this.replaceQuestion(questions, oldQuestion);
  }
  submit(): void {
    this.quizService.computeScore(this.questions ?? [], this.userAnswers);
    this.router.navigateByUrl("/result");
  }

}
