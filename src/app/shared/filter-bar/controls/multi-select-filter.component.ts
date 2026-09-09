import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { isObservable, of, switchMap } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FilterControl, FilterFieldConfig, FilterOption } from '../filter-bar.types';

/**
 * Multi-select filter control. Emits an array of selected values, or `undefined`
 * when nothing is selected. Options may be a static array or an Observable.
 */
@Component({
  selector: 'app-multi-select-filter',
  standalone: true,
  imports: [MatFormFieldModule, MatSelectModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './multi-select-filter.component.html',
})
export class MultiSelectFilterComponent implements FilterControl<string[]> {
  readonly config = input.required<FilterFieldConfig>();
  readonly value = input<string[] | undefined>();
  readonly valueChange = output<string[] | undefined>();

  protected readonly options = toSignal(
    toObservable(this.config).pipe(
      switchMap(({ options }) =>
        isObservable(options) ? options : of(options ?? []),
      ),
    ),
    { initialValue: [] as readonly FilterOption[] },
  );

  protected onChange(selected: string[]): void {
    this.valueChange.emit(selected.length ? selected : undefined);
  }
}
