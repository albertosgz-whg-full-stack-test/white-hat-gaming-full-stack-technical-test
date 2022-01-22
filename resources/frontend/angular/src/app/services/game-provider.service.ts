import { BehaviorSubject, Observable, Subject, catchError, filter, map, of, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GameProviderService {

  private providerId$: BehaviorSubject<number> = new BehaviorSubject(-1);
  private loading$: BehaviorSubject<boolean> = new BehaviorSubject(true as boolean);

  constructor(private httpClient: HttpClient) { }

  setProviderId(id: number) {
    this.providerId$.next(id);
  }

  getProviderName(): Observable<string> {
    return this.providerId$.asObservable().pipe(
      filter(id => id > 0),
      tap((id) => console.log('TAP', id)),
      tap(() => this.loading$.next(true)),
      switchMap(id => {
        let url = `http://localhost/api/provider/${id}`;
        return this.httpClient.get<any>(url).pipe(
          map((response: any) => response.data),
          catchError(err => {
            console.error(err);
            return of({ name: '' });
          })
        );
      }),
      tap(() => this.loading$.next(false)),
      map((data: any) => data.name),
    );
  }


  isLoading(): Observable<boolean> {
    return this.loading$.asObservable();
  }
}
