import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EventFormComponent } from './components/event-form.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, EventFormComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'eventsApp';
}
