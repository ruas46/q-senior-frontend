import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { FilterControlType, FilterFieldConfig } from './filter-bar.types';
import { TextFilterComponent } from './controls/text-filter.component';
import { MultiSelectFilterComponent } from './controls/multi-select-filter.component';
import { BooleanFilterComponent } from './controls/boolean-filter.component';

/**
 * Generic, config-driven filter bar.
 *
 * - It has **no dependency** on any concrete filter interface or on the table it
 *   feeds. `fields` says what to render; `valueChange` reports the composed
 *   filter object.
 * - It does **not** filter data and does **not** debounce - it emits on every
 *   change, so debounce on the consumer side before hitting a backend.
 * - A new field of an existing type is just another entry in `fields`; a new
 *   control type needs its component plus a `@case` in the template.
 *
 * @typeParam T shape of the filter object this instance composes.
 */
@Component({
  selector: 'app-filter-bar',
  standalone: true,
  imports: [
    MatButtonModule,
    TextFilterComponent,
    MultiSelectFilterComponent,
    BooleanFilterComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './filter-bar.component.html',
  styleUrl: './filter-bar.component.scss',
})
export class FilterBarComponent<
  T extends Record<string, unknown> = Record<string, unknown>,
> {
  /** Exposed for the template's `@switch`. */
  protected readonly FilterControlType = FilterControlType;

  /** Fields to render, in order. */
  readonly fields = input.required<readonly FilterFieldConfig[]>();
  /** Emits the composed, server-ready filter on every change. */
  readonly valueChange = output<Partial<T>>();

  /** Current filter, updated as the user edits fields. */
  protected readonly draft = signal<Record<string, unknown>>({});

  // computed: only recomputes when `draft` changes; cached otherwise.
  protected readonly activeCount = computed(
    () => Object.keys(this.draft()).length,
  );

  protected patch(key: string, raw: unknown): void {
    const value = typeof raw === 'string' ? raw.trim() : raw;
    const next = { ...this.draft() };
    if (isBlank(value)) {
      delete next[key];
    } else {
      next[key] = value;
    }
    this.emit(next);
  }

  protected clear(): void {
    this.emit({});
  }

  private emit(draft: Record<string, unknown>): void {
    this.draft.set(draft);
    this.valueChange.emit(draft as Partial<T>);
  }
}

/** A field value that should not appear in the emitted filter object. */
function isBlank(value: unknown): boolean {
  return (
    value == null ||
    value === '' ||
    (Array.isArray(value) && value.length === 0)
  );
}
