import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {CdkFixedSizeVirtualScroll, CdkVirtualForOf, CdkVirtualScrollViewport} from '@angular/cdk/scrolling';
import {MatCheckbox} from '@angular/material/checkbox';
import {MatButton} from '@angular/material/button';

interface Row {
  id: number;
  title: string;
}

function createRows(): Row[] {
  return Array.from({length: 50000}, (_, i) => i).map(i => ({id: i, title: `Item ${i}`}))
}

@Component({
  selector: 'app-task2',
  imports: [
    CdkVirtualScrollViewport,
    MatCheckbox,
    CdkVirtualForOf,
    CdkFixedSizeVirtualScroll,
    MatButton
  ],
  standalone: true,
  templateUrl: './task2.component.html',
  styleUrls: ['./task2.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Task2Component {
  readonly rows = signal<Row[]>(createRows());

  // Using signal and ids check > Angular re-render only when it changes
  private readonly _selectedIds = signal<ReadonlySet<number>>(new Set<number>());

  isSelected(id: number): boolean {
    return this._selectedIds().has(id);
  }

  trackById(_index: number, row: Row): number {
    return row.id;
  }

  toggle(id: number): void {
    this._selectedIds.update((current) => {
      const next = new Set(current);
      // Set.delete returns false when the id was not present > select it
      if (!next.delete(id)) {
        next.add(id);
      }
      return next;
    });
  }

  selectAll(): void {
    // One O(n) pass, one signal write, one change-detection cycle
    this._selectedIds.set(new Set(this.rows().map((row) => row.id)));
  }

  deselectAll(): void {
    this._selectedIds.set(new Set<number>());
  }

  recreateData(): void {
    // Row identities change, ids do not > the selection stays valid as-is
    this.rows.set(createRows());
  }
}
