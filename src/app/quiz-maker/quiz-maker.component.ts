import { Component, ElementRef, ViewChild } from '@angular/core';
import { Category, Difficulty, Question } from '../data.models';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { QuizService } from '../quiz.service';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-quiz-maker',
  templateUrl: './quiz-maker.component.html',
  styleUrls: ['./quiz-maker.component.css']
})
export class QuizMakerComponent {

  categories$: Observable<Category[]>;
  categories: Category[] = [];
  questions$!: Observable<Question[]>;
  private subCategoriesSubject: BehaviorSubject<Category[]> = new BehaviorSubject<Category[]>([]);
  selectedCategoryName$ = new BehaviorSubject<string | null>(null);
  subCategories$: Observable<Category[]> | undefined;
  @ViewChild('category') categoryDropdown: ElementRef | undefined;
  subCategoryValue: number | undefined;

  constructor(protected quizService: QuizService) {
    this.categories$ = quizService.getAllCategories().pipe(
      tap(categories => this.categories = categories)
    );
    this.subCategories$ = combineLatest([
      this.categories$,
      this.selectedCategoryName$.asObservable()
  ]).pipe(
      map(([categories, selectedName]) => {
          if (selectedName === "Entertainment" || selectedName === "Science") {
              const mainCategory = categories.find(cat => cat.name === selectedName);
              console.log('Main Category:', mainCategory?.subcategories);
              return mainCategory?.subcategories || [];
          }
          return [];
      })
  );
  
  }

  onCategoryChange(value: string): void {
    const [selectedCategoryId, selectedCategoryName] = value.split(',').map(v => v.trim());
    console.log('Selected Category ID:', selectedCategoryId);
    console.log('Selected Category Name:', selectedCategoryName);
    this.selectedCategoryName$.next(selectedCategoryName);
    const selectedCategory = this.categories.find(category => category.name === selectedCategoryName);
    console.log('Selected Category:', selectedCategory);
    
    if (selectedCategory && selectedCategory.subcategories) {
      this.subCategoriesSubject.next(selectedCategory.subcategories);
    } else {
      this.subCategoriesSubject.next([]);
    }
}
onSubCategoryChange(selectedSubCategoryId: number): void {
  console.log('Selected Subcategory ID:', selectedSubCategoryId);
  this.subCategoryValue = selectedSubCategoryId;
}

createQuiz(value: string, subcategoriesValue: number|undefined,difficulty: string): void {
  const [selectedCategoryId] = value.split(',');
  const catId = Number(selectedCategoryId) || subcategoriesValue || 0;

  this.questions$ = this.quizService.createQuiz(catId.toString(), difficulty as Difficulty);
}
}
