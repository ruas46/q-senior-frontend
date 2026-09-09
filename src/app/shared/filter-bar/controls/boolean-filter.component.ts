import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FilterControl, FilterFieldConfig } from '../filter-bar.types';

/**
 * Tri-state boolean filter control: "Any" / true / false.
 *
 * A plain checkbox cannot express the three states an optional boolean filter
 * needs (`true`, `false`, and "don't filter"), so this uses a button toggle
 * group where "Any" emits `undefined`.
 */
@Component({
  selector: 'app-boolean-filter',
  standalone: true,
  imports: [MatButtonToggleModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './boolean-filter.component.html',
  styleUrl: './boolean-filter.component.scss',
})
export class BooleanFilterComponent implements FilterControl<boolean> {
  readonly config = input.required<FilterFieldConfig>();
  readonly value = input<boolean | undefined>();
  readonly valueChange = output<boolean | undefined>();
}
