import { Component } from '@angular/core';

@Component({
  selector: 'ph-hello',
  standalone: true,
  template: `
    <div>
      <span>Hello from PH Angular Components!</span>
    </div>
  `,
  styles: [
    `
      div {
        padding: 1rem;
        background-color: #f0f0f0;
        border-radius: 4px;
        margin: 1rem 0;
      }

      span {
        color: #333;
        font-size: 1rem;
      }
    `
  ]
})
export class HelloComponent {}
