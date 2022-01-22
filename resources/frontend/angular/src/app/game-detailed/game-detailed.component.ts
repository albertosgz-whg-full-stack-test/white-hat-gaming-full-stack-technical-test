import { Observable, Subscription, of } from 'rxjs';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FilterOption } from '../services/filters.service';
import { GameProviderService } from '../services/game-provider.service';
import { GameData } from '../services/games.service';

@Component({
  selector: 'app-game-detailed',
  templateUrl: './game-detailed.component.html',
  styleUrls: ['./game-detailed.component.scss']
})
export class GameDetailedComponent implements OnInit, OnDestroy {

  @Input() game: GameData|undefined;
  @Input() brand: FilterOption|undefined;
  @Input() category: FilterOption|undefined;

  providerNameLoading: boolean = true;
  providerName$: Observable<string>;
  private subs$: Subscription[] = [];

  constructor(private providerService: GameProviderService) {
    this.providerName$ = this.providerService.getProviderName();
  }


  ngOnInit(): void {
    this.providerService.setProviderId(this.game?.game_provider_id as number);
    this.subs$.push(
      this.providerService.isLoading().subscribe(value => this.providerNameLoading = value)
    );
  }

  ngOnDestroy(): void {
    this.subs$.forEach((sub$) => sub$.unsubscribe());
  }


  get imgSource(): string | undefined {
    if (this.game?.launchcode) {
      return `https://stage.whgstage.com/scontent/images/games/${this.game?.launchcode}.jpg`;
    }
    return undefined;
  }
}
