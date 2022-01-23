import { Observable, Subject, Subscription, distinctUntilChanged, filter, of, tap } from 'rxjs';
import {
  HttpClient,
  HttpEvent,
  HttpHeaders,
  HttpParams,
  HttpResponse
} from '@angular/common/http';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FiltersService } from '../services/filters.service';

export interface SelectOption {
  id: number|string;
  name: string;
}

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: [
    './select.component.scss',
  ],
  providers: [FiltersService],
})
export class SelectComponent implements OnInit, OnChanges, OnDestroy {

  @Input() url: string = '';
  @Input() setInitValue: string = '';
  @Input() clearable: boolean = false;
  @Input() selectFirst: boolean = true;
  @Input() disabled: boolean = false;
  @Input() placeholder: string = 'Select one item';
  @Input() itemSelected: SelectOption|undefined;
  @Output() itemSelectedChange: EventEmitter<SelectOption> = new EventEmitter();

  searchTermInput$ = new Subject<string>();
  items$: Observable<SelectOption[]> = of([]);
  noMoreFiltersAvailable = false;
  private subscription$: Subscription[] = [];
  private setupInitialValue = false;
  private currentAmountOfFilters = 0;


  constructor(private filters: FiltersService) { }

  ngOnInit(): void {
    this.subscription$.push(
      this.searchTermInput$
      .pipe(
        distinctUntilChanged(),
        filter(term => term !== null),
      )
      .subscribe(term => {
        this.filters.setFilter(term);
      })
    );


    this.items$ = this.filters.getFilters().pipe(
      tap((filters) => {
        this.noMoreFiltersAvailable = filters.length === this.currentAmountOfFilters;
        this.currentAmountOfFilters = filters.length;
      }),
      tap(items => {
        if (!this.setupInitialValue && this.selectFirst) {
          this.onSelectChange(items[0]);
        }
        this.setupInitialValue = true;
      })
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!!changes['url']) {
      this.filters.setUrl(this.url);
    }
  }

  get loading(): Observable<boolean> {
    return this.filters.isLoading();
  }

  ngOnDestroy(): void {
    this.subscription$.forEach(sub$ => sub$.unsubscribe());
  }

  loadMore(forceFetch?: boolean) {
    if (forceFetch || !this.noMoreFiltersAvailable) {
      this.filters.fetchNextPage();
    }
  }

  onSelectChange(value: SelectOption) {

    // Get initial list again once an option is selected
    this.filters.setFilter('');

    this.itemSelectedChange.emit(value);
  }
}
