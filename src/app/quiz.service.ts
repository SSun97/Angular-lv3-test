import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {Category, Difficulty, ApiQuestion, Question, Results} from './data.models';

@Injectable({
  providedIn: 'root'
})
export class QuizService {

  private API_URL = "https://opentdb.com/";
  private latestResults!: Results;

  constructor(private http: HttpClient) {
  }

  getAllCategories(): Observable<Category[]> {
    return this.http.get<{ trivia_categories: Category[] }>(this.API_URL + "api_category.php").pipe(
      map(res => {
        const categories = res.trivia_categories;

        const entertainment = {
          name: "Entertainment",
          subcategories: categories.filter(category => category.name.startsWith('Entertainment:'))
            .map(category => {
              return { id: category.id, name: category.name.split(': ')[1] };  // Split to get the subcategory name
            })
            .sort((a, b) => a.name.localeCompare(b.name))  // Sort subcategories by name
        };

        const science = {
          name: "Science",
          subcategories: categories.filter(category => category.name.startsWith('Science:'))
            .map(category => {
              return { id: category.id, name: category.name.split(': ')[1] }; 
            })
            .sort((a, b) => a.name.localeCompare(b.name)) 
        };

        const others = categories.filter(category => !category.name.startsWith('Entertainment:') && !category.name.startsWith('Science:'))
          .map(category => ({
            name: category.name,
            id: category.id
          }));

        // Combine the results
        const combined = [{...entertainment}, {...science}, ...others];

        // Sort the main categories based on the name
        return combined.sort((a, b) => a.name.localeCompare(b.name));
      })
    );
}

  createQuiz(categoryId: string, difficulty: Difficulty): Observable<Question[]> {
    return this.http.get<{ results: ApiQuestion[] }>(
        `${this.API_URL}/api.php?amount=5&category=${categoryId}&difficulty=${difficulty.toLowerCase()}&type=multiple`)
      .pipe(
        map(res => {
          const quiz: Question[] = res.results.map(q => (
            {...q, all_answers: [...q.incorrect_answers, q.correct_answer].sort(() => (Math.random() > 0.5) ? 1 : -1)}
          ));
          return quiz;
        })
      );
  }
  getQuestion(categoryId: string, difficulty: Difficulty): Observable<Question[]> {
    return this.http.get<{ results: ApiQuestion[] }>(
        `${this.API_URL}/api.php?amount=1&category=${categoryId}&difficulty=${difficulty.toLowerCase()}&type=multiple`)
      .pipe(
        map(res => {
          const question: Question[] = res.results.map(q => (
            {...q, all_answers: [...q.incorrect_answers, q.correct_answer].sort(() => (Math.random() > 0.5) ? 1 : -1)}
          ));
          return question;
        })
      );
  }
  computeScore(questions: Question[], answers: string[]): void {
    let score = 0;
    questions.forEach((q, index) => {
      if (q.correct_answer == answers[index])
        score++;
    })
    this.latestResults = {questions, answers, score};
  }

  getLatestResults(): Results {
    return this.latestResults;
  }
}
