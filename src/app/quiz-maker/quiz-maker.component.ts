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
  @ViewChild('difficulty') difficulty: ElementRef<HTMLSelectElement> | undefined;
  subCategoryValue: number | undefined;
  selectedValue: string | null = null;

  constructor(protected quizService: QuizService) {
    this.categories$ = quizService.getAllCategories().pipe(
      tap(categories => {this.categories = categories; console.log('Categories:', categories);})
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
  handleSelectedValueChange(value: string): void {
    const [selectedCategoryId, selectedCategoryName] = value.split(',').map(v => v.trim());
    this.selectedValue = value;
    selectedCategoryId
    this.saveToLocalStorage();
    this.selectedCategoryName$.next(selectedCategoryName);
  }

  saveToLocalStorage(): void {
    const quizData = {
      selectedValue: this.selectedValue,
      subCategoryValue: this.subCategoryValue ?? undefined,
      difficulty: this.difficulty?.nativeElement?.value ?? ''
    };
    localStorage.setItem('quizData', JSON.stringify(quizData));
  }
handleSelectedSubValueChange(value: string): void {
  this.selectedValue = value;
  this.saveToLocalStorage();
}
  onCategoryChange(value: string): void {
    const [selectedCategoryId, selectedCategoryName] = value.split(',').map(v => v.trim());
    selectedCategoryId
    this.selectedCategoryName$.next(selectedCategoryName);
    const selectedCategory = this.categories.find(category => category.name === selectedCategoryName);
    
    if (selectedCategory && selectedCategory.subcategories) {
      this.subCategoriesSubject.next(selectedCategory.subcategories);
    } else {
      this.subCategoriesSubject.next([]);
    }
    this.saveToLocalStorage();
}
onSubCategoryChange(selectedSubCategoryId: number | undefined): void {
  this.subCategoryValue = selectedSubCategoryId;
  this.saveToLocalStorage();
}

createQuiz( value: string | null ,subcategoriesValue: number|undefined,difficulty: string): void {
  const [selectedCategoryId] = value?.split(',') || [];
  const catId = Number(selectedCategoryId) || subcategoriesValue || 0;

  this.questions$ = this.quizService.createQuiz(catId.toString(), difficulty as Difficulty);
  this.saveToLocalStorage();
}
}
