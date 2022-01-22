import { BehaviorSubject, Observable, Subject, catchError, combineLatest, combineLatestAll, filter, map, of, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface GameData {
  launchcode: number;
  name: string;
  rtp: number;
  hot: boolean;
  new: boolean;
  game_provider_id: number;
  brand_id: number;
  category: string;
}

export interface GameRequestConfiguration {
  brandId: number|undefined;
  countryId: number|undefined;
  category: string|undefined;
  page: number;
}

@Injectable({
  // Is fine the singleton configuration since only one instance is needed across the whole app
  providedIn: 'root'
})
export class GamesService {

  private request$: BehaviorSubject<GameRequestConfiguration> = new BehaviorSubject({
    brandId: undefined,
    countryId: undefined,
    category: undefined,
    page: 1,
  } as GameRequestConfiguration);
  private loading$: Subject<boolean> = new Subject();
  private currentGames: GameData[] = [];

  constructor(private httpClient: HttpClient) { }

  get games(): Observable<GameData[]> {
    return this.request$.asObservable().pipe(
      filter(configuration => !!configuration.brandId && !!configuration.countryId),
      tap(() => this.loading$.next(true)),
      switchMap(configuration => {
        let url = `http://localhost/api/games?page=${configuration.page}&brand_id=${configuration.brandId}&country_id=${configuration.countryId}`;
        if (configuration.category) {
          url += '&category=' + configuration.category;
        }
        return this.httpClient.get<GameData[]>(url).pipe(
          map((response: any) => response.data),
          catchError(err => {
            console.error(err);
            return of([]);
          })
        );
      }),
      tap(() => this.loading$.next(false)),
      map((newItems: GameData[]) => ([
        ...this.currentGames,
        ...newItems,
      ])),
      tap(items => this.currentGames = items),
    )
  }

  fetchNextPage() {
    this.request$.next({
        ...this.request$.value,
        page: this.request$.value.page + 1,
    });
  }

  setBrand(brandId: number) {
    this.currentGames = [];
    this.request$.next({
      ...this.request$.value,
      page: 1,
      brandId,
    });
  }

  setCountry(countryId: number) {
    this.currentGames = [];
    this.request$.next({
      ...this.request$.value,
      page: 1,
      countryId,
    });
  }

  setCategory(category: string) {
    this.currentGames = [];
    this.request$.next({
      ...this.request$.value,
      page: 1,
      category,
    });
  }

  isLoading(): Observable<boolean> {
    return this.loading$;
  }
}
