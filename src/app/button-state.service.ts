import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ButtonStateService {

  // A BehaviorSubject to manage the button's visibility state
  private showChangeButtonSubject = new BehaviorSubject<boolean>(true);
  showChangeButton$: Observable<boolean> = this.showChangeButtonSubject.asObservable();

  // Function to update the state
  hideChangeButton(): void {
    this.showChangeButtonSubject.next(false);
  }
  refreshChangeButton(): void {
    this.showChangeButtonSubject.next(true);
  }

}