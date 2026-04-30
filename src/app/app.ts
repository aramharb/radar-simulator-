import { Component, signal } from '@angular/core';
import { Controller } from './controller/controller';
import { Instructor } from './instructor/instructor';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Controller , Instructor],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('my-angular-app');
}
