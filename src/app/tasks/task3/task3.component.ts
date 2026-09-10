import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import {
  CategoryScale,
  Chart,
  ChartConfiguration,
  Filler,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Tooltip,
} from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { CollectibleAsset, SMILEY_ASSET } from './asset.data';

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
  Tooltip,
);

const compactEur = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 1,
});

@Component({
  selector: 'app-task3',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, BaseChartDirective],
  templateUrl: './task3.component.html',
  styleUrl: './task3.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Task3Component {
  protected readonly asset: CollectibleAsset = SMILEY_ASSET;

  protected readonly chartData: ChartConfiguration<'line'>['data'] = {
    labels: this.asset.valueHistory.map((p) => String(p.year)),
    datasets: [
      {
        data: this.asset.valueHistory.map((p) => p.value),
        borderColor: '#9a7b28',
        backgroundColor: 'rgba(154, 123, 40, 0.14)',
        borderWidth: 2.5,
        fill: true,
        tension: 0.3,
        pointRadius: 0,
        pointHoverRadius: 4,
      },
    ],
  };

  protected readonly chartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: {
        beginAtZero: true,
        border: { display: false },
        grid: { color: '#e7e3db' },
        // callback formats each axis tick: 4000000 -> "€4M" instead of the raw number
        ticks: { color: '#6f6b64', callback: (v) => compactEur.format(Number(v)) },
      },
      x: {
        border: { display: false },
        grid: { display: false },
        ticks: { color: '#6f6b64' },
      },
    },
  };
}
