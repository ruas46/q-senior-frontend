import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { AsyncPipe } from '@angular/common';
import { BehaviorSubject, debounceTime, forkJoin, map, switchMap } from 'rxjs';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatNoDataRow,
  MatRow,
  MatRowDef,
} from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { indicate } from '../../utils';
import { Security } from '../../models/security';
import { PagingFilter, SecuritiesFilter } from '../../models/securities-filter';
import { SecurityService } from '../../services/security.service';
import { FilterableTableComponent } from '../filterable-table/filterable-table.component';
import { FilterBarComponent } from '../../shared/filter-bar/filter-bar.component';
import {
  FilterControlType,
  FilterFieldConfig,
  FilterOption,
} from '../../shared/filter-bar/filter-bar.types';

const PAGE_SIZE_OPTIONS = [10, 25, 50];

const toOptions = (values: string[]): FilterOption[] =>
  values.map((value) => ({ label: value, value }));

@Component({
  selector: 'securities-list',
  standalone: true,
  imports: [
    FilterableTableComponent,
    FilterBarComponent,
    MatPaginatorModule,
    AsyncPipe,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatCell,
    MatCellDef,
    MatHeaderRow,
    MatHeaderRowDef,
    MatNoDataRow,
    MatRowDef,
    MatRow,
  ],
  templateUrl: './securities-list.component.html',
  styleUrl: './securities-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SecuritiesListComponent {
  private readonly _securityService = inject(SecurityService);

  protected readonly displayedColumns: string[] = ['name', 'type', 'currency'];
  protected readonly pageSizeOptions = PAGE_SIZE_OPTIONS;
  protected readonly loadingSecurities$ = new BehaviorSubject<boolean>(false);

  /**
   * Field definitions for the generic filter bar. This is the only place that
   * knows the shape of `SecuritiesFilter`; the filter bar stays generic.
   */
  protected readonly filterFields: FilterFieldConfig[] = [
    {
      key: 'name',
      type: FilterControlType.Text,
      label: 'Name',
      placeholder: 'Search by name',
    },
    {
      key: 'types',
      type: FilterControlType.MultiSelect,
      label: 'Type',
      options: this._securityService.getSecurityTypes().pipe(map(toOptions)),
    },
    {
      key: 'currencies',
      type: FilterControlType.MultiSelect,
      label: 'Currency',
      options: this._securityService.getCurrencies().pipe(map(toOptions)),
    },
    {
      key: 'isPrivate',
      type: FilterControlType.Boolean,
      label: 'Visibility',
      trueLabel: 'Private',
      falseLabel: 'Public',
    },
  ];

  private readonly _filter = signal<SecuritiesFilter>({});
  private readonly _paging = signal<PagingFilter>({
    skip: 0,
    limit: PAGE_SIZE_OPTIONS[0],
  });

  // filter + paging merged - the object sent to the backend
  private readonly _query = computed<SecuritiesFilter>(() => ({
    ...this._filter(),
    ...this._paging(),
  }));

  // Server-side filtering and paging (skip/limit go to the backend).
  // `debounceTime` coalesces rapid edits (the filter bar emits on every
  // keystroke); `switchMap` drops a superseded response; the count is fetched
  // alongside so the paginator has a length.
  private readonly _page = toSignal(
    toObservable(this._query).pipe(
      debounceTime(200),
      switchMap((query) =>
        forkJoin({
          items: this._securityService.getSecurities(query),
          total: this._securityService.getSecuritiesCount(query),
        }).pipe(indicate(this.loadingSecurities$)),
      ),
    ),
    { initialValue: { items: [] as Security[], total: 0 } },
  );

  // computed: only recomputes when `_page` changes; cached otherwise.
  protected readonly securities = computed(() => this._page().items);
  protected readonly total = computed(() => this._page().total);

  protected readonly pageSize = computed(
    () => this._paging().limit ?? PAGE_SIZE_OPTIONS[0],
  );
  protected readonly pageIndex = computed(() => {
    const { skip = 0 } = this._paging();
    return this.pageSize() ? Math.floor(skip / this.pageSize()) : 0;
  });

  protected onFilterChange(value: Partial<SecuritiesFilter>): void {
    this._filter.set(value);
    this._paging.update((paging) => ({ ...paging, skip: 0 })); // back to page 1
  }

  protected onPage(event: PageEvent): void {
    this._paging.set({
      skip: event.pageIndex * event.pageSize,
      limit: event.pageSize,
    });
  }
}
