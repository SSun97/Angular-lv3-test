import {Component} from '@angular/core';
import {Category, Difficulty, Question, groupCategoriesByType} from '../data.models';
import {Observable, of} from 'rxjs';
import {QuizService} from '../quiz.service';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { switchMap, tap, map } from 'rxjs/operators';
@Component({
  selector: 'app-quiz-maker',
  templateUrl: './quiz-maker.component.html',
  styleUrls: ['./quiz-maker.component.css']
})


export class QuizMakerComponent {

  categories$: Observable<groupCategoriesByType> = this.quizService.getAllCategories();
  category: Category | undefined;
  questions$!: Observable<Question[]>;

  private selectedGroup$ = new BehaviorSubject<string | null>(null);
  private selectedCategoryId$ = new BehaviorSubject<number | null>(null);

  subCategories$ = combineLatest([this.selectedGroup$, this.categories$]).pipe(
    map(([groupKey, categories]) => {
      const subCategories = categories[groupKey as keyof groupCategoriesByType] || [];
      console.log("Sub Categories:", subCategories);
      return subCategories;
    })
  );
  

  constructor(protected quizService: QuizService) {
    this.categories$ = quizService.getAllCategories();
  }

  onGroupSelected(group: string): void {
    this.selectedGroup$.next(group);
    this.selectedCategoryId$.next(null); // Reset the category when group changes
  }

  onCategorySelected(catId: number): void {
    this.selectedCategoryId$.next(catId);
  }
  createQuiz(cat: string, difficulty: string): void {
    console.log(cat, difficulty);
    this.questions$ = this.quizService.createQuiz(cat, difficulty as Difficulty);
    console.log(this.questions$);
  }

}

