import { Observable } from 'rxjs';

/**
 * Identifies which control component renders a field. Every `FilterFieldConfig`
 * uses a member of this enum; the filter bar has a `@case` per member.
 */
export enum FilterControlType {
  Text = 'text',
  MultiSelect = 'multi-select',
  Boolean = 'boolean',
}

/** One selectable option for choice-based controls (select / multi-select). */
export interface FilterOption {
  readonly label: string;
  readonly value: string;
}

/**
 * Declarative description of a single field rendered by the filter bar.
 *
 * The filter bar itself only reads `key`, `type` and `label`. Every other
 * property is consumed by the control component for that `type`. Adding a field
 * to a filter interface therefore means adding one entry to a config array - no
 * change to the bar or its controls.
 */
export interface FilterFieldConfig {
  /** Property this field contributes to the emitted filter object. */
  readonly key: string;
  /** Which control renders this field. */
  readonly type: FilterControlType;
  /** Human-readable label. */
  readonly label: string;
  /** Options for `select` / `multi-select` controls; array or async. */
  readonly options?: readonly FilterOption[] | Observable<readonly FilterOption[]>;
  /** Placeholder for text controls. */
  readonly placeholder?: string;
  /** Labels for the two defined states of a tri-state boolean control. */
  readonly trueLabel?: string;
  readonly falseLabel?: string;
}

/**
 * Contract every filter control component fulfils. Controls are intentionally
 * "dumb": they receive their `config` and current `value` and report user edits
 * through `valueChange`. They know nothing about the filter bar, the filter
 * object being composed, or each other.
 *
 * `config` / `value` are Angular signal inputs (callable); `valueChange` is a
 * signal output - typed structurally here to keep this file
 * framework-symbol-free.
 */
export interface FilterControl<V = unknown> {
  readonly config: () => FilterFieldConfig;
  readonly value: () => V | undefined;
  readonly valueChange: { emit(value: V | undefined): void };
}
