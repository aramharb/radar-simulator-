import { Component } from '@angular/core';
import { Dashboard } from './dashboard/dashboard';

@Component({
  selector: 'app-controller',
  standalone: true,
  imports: [Dashboard],
  templateUrl: './controller.html',
  styleUrl: './controller.css',
})
export class Controller {

}
