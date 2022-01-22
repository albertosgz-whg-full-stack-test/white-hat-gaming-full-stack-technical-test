import { Observable, lastValueFrom, tap } from 'rxjs';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { GameDetailedComponent } from './game-detailed/game-detailed.component';
import { FilterOption } from './services/filters.service';
import { GameData, GamesService } from './services/games.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  brand: FilterOption|undefined = undefined;
  country: FilterOption|undefined = undefined;
  category: FilterOption|undefined = undefined;
  games$: Observable<GameData[]>;
  noMoreGamesAvailable = false;
  private currentAmountOfGames = 0;

  @ViewChild('itemsList', {static: true}) itemsList: any;

  constructor(
    private gamesService: GamesService,
    private dialogService: NbDialogService,
  ) {
    this.games$ = gamesService.games.pipe(
      tap((games) => {
        this.noMoreGamesAvailable = games.length === this.currentAmountOfGames;
        this.currentAmountOfGames = games.length;
      }),
      tap(() => {
          // Keep downloading games until scroll shows up
          const nativeElement = this.itemsList.nativeElement;
          if (nativeElement.scrollHeight <= nativeElement.clientHeight) {
            this.fetchMoreGames();
          }
      }),
    );
  }

  onBrandSelected(filter: FilterOption) {
    this.brand = filter;
    this.gamesService.setBrand(filter.id as number);
  }

  onCountrySelected(filter: FilterOption) {
    this.country = filter;
    this.gamesService.setCountry(filter.id as number);
  }

  onCategorySelected(filter: FilterOption) {
    this.category = filter;
    this.gamesService.setCategory(filter.id as string);
  }

  fetchMoreGames() {
    if (!this.noMoreGamesAvailable) {
      this.gamesService.fetchNextPage();
    }
  }

  imgSource(game: GameData): string {
    return `https://stage.whgstage.com/scontent/images/games/${game.launchcode}.jpg`;
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
