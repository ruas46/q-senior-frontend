import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FilterControl, FilterFieldConfig } from '../filter-bar.types';

/**
 * Free-text filter control. Emits the raw input value, or `undefined` when
 * empty; the filter bar trims it and drops blank fields.
 */
@Component({
  selector: 'app-text-filter',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './text-filter.component.html',
})
export class TextFilterComponent implements FilterControl<string> {
  readonly config = input.required<FilterFieldConfig>();
  readonly value = input<string | undefined>();
  readonly valueChange = output<string | undefined>();
}
