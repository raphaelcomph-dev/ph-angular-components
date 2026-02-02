import { Component, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HelloComponent, InputNumberComponent, InputDateComponent } from 'ui';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HelloComponent, InputNumberComponent, InputDateComponent, DatePipe],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('demo');
  protected readonly numberValue = signal(5);
  protected readonly selectedDate = signal<Date | null>(null);

  handleDateChange(dateString: string | null): void {
    if (dateString) {
      this.selectedDate.set(new Date(dateString));
    } else {
      this.selectedDate.set(null);
    }
  }
}
