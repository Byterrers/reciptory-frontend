import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class MediatorService {
  private mediatorEvent: BehaviorSubject<string> = new BehaviorSubject('');

  getMediatorEvent(): Observable<string> {
    return this.mediatorEvent.asObservable();
  }

  set mediator(value: string) {
    this.mediatorEvent.next(value);
  }
}
