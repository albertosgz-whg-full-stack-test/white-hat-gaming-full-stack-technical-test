import { BehaviorSubject, Observable, Subject, catchError, combineLatest, filter, map, of, switchMap, tap } from 'rxjs';
import {
  HttpClient,
} from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface FilterOption {
  id: number|string;
  name: string;
}

@Injectable({
  // I don't want a singleton service across the whole app
  providedIn: null
})
export class FiltersService {

  private url$: BehaviorSubject<string> = new BehaviorSubject('');
  private request$: BehaviorSubject<{ page: number; filter: string; }> = new BehaviorSubject({ page: 1, filter: '' });
  private currentItems: FilterOption[] = [];
  private loading$: Subject<boolean> = new Subject();

  constructor(private httpClient: HttpClient) { }

  getFilters(): Observable<FilterOption[]> {

    return combineLatest([
      this.url$.asObservable().pipe(
        filter(url => !!url),
      ),
      this.request$.asObservable(),
    ])
      .pipe(
        tap(() => this.loading$.next(true)),
        switchMap((observables: any) => {
          const url = observables[0];
          const params = observables[1];
          return this.httpClient.get<FilterOption[]>(`http://localhost${url}?page=${params.page}&filter=${params.filter}`).pipe(
            catchError(err => {
              console.error(err);
              return of([]);
            }),
          );
        }),
        tap(() => this.loading$.next(false)),
        map((newItems: any) => (newItems.data.map((item: any) => ({
          ...item,
          id: item.id || item.name,
        })))),
        map((newItems: FilterOption[]) => ([
          ...this.currentItems,
          ...newItems,
        ])),
        tap(items => this.currentItems = items),
      );
  }

  fetchNextPage() {
    const currentPage = this.request$.value.page;
    this.request$.next({
      ...this.request$.value,
      page: currentPage+1,
    });
  }

  setUrl(url: string) {
    this.url$.next(url);
  }

  setFilter(filter: string) {
    this.currentItems = [];
    this.request$.next({
      ...this.request$.value,
      filter,
      page: 1,
    });
  }

  isLoading(): Observable<boolean> {
    return this.loading$;
  }
}
