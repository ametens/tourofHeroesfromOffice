import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: ['./hero-search.component.css']
})
export class HeroSearchComponent implements OnInit {

  //heroes$ as an Observable
  heroes$: Observable<Hero[]>;

  /***
   * A Subject is both a source of observable values and an Observable itself.
   * You can subscribe to a Subject as you would any Observable.
   * You can also push values into that Observable by calling
   * its next(value) method as the search() method does.
   * The event binding to the textbox's input event
   * calls the search() method.
   */
  private searchTerms = new Subject<string>();

  /**
   * * Push a search term into the observable stream. * *
   */
  search(term: string): void {
    this.searchTerms.next(term);
  }

  constructor(private heroService: HeroService) {}

  ngOnInit(): void {
    this.heroes$ = this.searchTerms.pipe(


      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      /**
       * With the switchMap operator,
       * every qualifying key event can trigger an HttpClient.get() method call.
       * */
      switchMap((term:string) => this.heroService.searchHeroes(term)),
      );
  }
}
