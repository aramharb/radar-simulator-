import { Component } from '@angular/core';
import { Dashboard } from "../controller/dashboard/dashboard";
import { Exercice } from "../exercice/exercice";

@Component({
  selector: 'app-instructor',
  imports: [Dashboard, Exercice],
  templateUrl: './instructor.html',
  styleUrl: './instructor.css',
})
export class Instructor {

}
