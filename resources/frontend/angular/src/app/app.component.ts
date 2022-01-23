import { Observable, Subscription, lastValueFrom, tap } from 'rxjs';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { GameDetailedComponent } from './game-detailed/game-detailed.component';
import { FilterOption } from './services/filters.service';
import { GameData, GamesService } from './services/games.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  brand: FilterOption|undefined = undefined;
  country: FilterOption|undefined = undefined;
  category: FilterOption|undefined = undefined;
  games: GameData[] = [];
  noMoreGamesAvailable = false;
  errorImages: { [launchcode: string]: string } = {};
  loadingGames = true;
  private currentAmountOfGames = 0;
  private subscriptions$: Subscription[] = [];

  @ViewChild('itemsList', {static: true}) itemsList: any;

  constructor(
    private gamesService: GamesService,
    private dialogService: NbDialogService,
  ) { }

  ngOnInit(): void {
    this.subscriptions$.push(
      this.gamesService.isLoading().subscribe(loading => this.loadingGames = loading)
    );
    this.subscriptions$.push(
      this.gamesService.games.pipe(
        tap((games) => {
          this.noMoreGamesAvailable = games.length === this.currentAmountOfGames;
          this.currentAmountOfGames = games.length;
        }),
        tap(() => {
          setTimeout(() => {
            // Keep downloading games until scroll shows up
            const nativeElement = this.itemsList?.nativeElement;
            if (nativeElement && nativeElement.scrollHeight <= nativeElement.clientHeight) {
              this.fetchMoreGames(false);
            }
          })
        }),
      ).subscribe(games => this.games = games)
    )
  }

  ngOnDestroy(): void {
    this.subscriptions$.forEach(sub$ => sub$.unsubscribe());
  }

  onBrandSelected(filter: FilterOption) {
    this.brand = filter;
    this.gamesService.setBrand(filter.id as number);
  }

  onCountrySelected(filter: FilterOption) {
    this.country = filter;
    this.gamesService.setCountry(filter.id as number);
  }

  onCategorySelected(filter?: FilterOption) {
    this.category = filter;
    this.gamesService.setCategory(filter?.id as string);
  }

  fetchMoreGames(forceFetch: boolean) {
    if (forceFetch || !this.noMoreGamesAvailable) {
      this.gamesService.fetchNextPage();
    }
  }

  imgSource(game: GameData): string {
    return `https://stage.whgstage.com/scontent/images/games/${game.launchcode}.jpg`;
  }

  onImgError(game: GameData) {
    this.errorImages[game.launchcode] = 'https://via.placeholder.com/260x164.png?text=Error+getting+image';
  }

  onClickGame(game: GameData) {
    this.dialogService.open(GameDetailedComponent, {
      context: {
        game,
        brand: this.brand,
        category: this.category,
      },
    });
  }
}
