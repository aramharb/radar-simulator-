import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

@Component({
  selector: 'app-exercice',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './exercice.html',
  styleUrl: './exercice.css',
})
export class Exercice implements OnInit {
  exerciceForm: FormGroup;

  availableAerodromes = [
    { label: 'DTTA', designation: 'Tunis' },
    { label: 'DTTB', designation: 'Bizerte' },
    { label: 'DTTI', designation: 'Nfitha' },
    { label: 'LICJ', designation: 'Palermo' },
    { label: 'CCR', designation: 'Concord / Buchanan Field' }
  ];

  aircraftTypes = [
    { actype: 'BE19', category: 'A' },
    { actype: 'BE35', category: 'A' },
    { actype: 'AC56', category: 'B' },
    { actype: 'AC68', category: 'B' },
    { actype: 'BE50', category: 'B' },
    { actype: 'A306', category: 'M' },
    { actype: 'B731', category: 'M' }
  ];

  constructor(private fb: FormBuilder) {
    this.exerciceForm = this.fb.group({
      exercicename: ['', Validators.required],
      aerodrome: ['', Validators.required],
      planes: this.fb.array([])
    });
  }

  ngOnInit(): void {
    // Add an initial plane
    this.addPlane();
  }

  get planes(): FormArray {
    return this.exerciceForm.get('planes') as FormArray;
  }

  addPlane() {
    const planeGroup = this.fb.group({
      // Exercice-specific attributes for this plane
      ssrcode: ['', Validators.required],
      ssrstatus: ['0'],
      startingtime: ['', Validators.required],
      showtime: [''],
      fltscope: ['I'],
      status: ['E'],
      transponder: ['1'],
      modec: ['1'],
      
      // Additional variables defined by instructor per plane
      starting_point: ['', Validators.required],
      procedure: [''],
      points: [''],

      // Flight Plan details (these normally go into fltplans)
      fltid: ['', Validators.required],
      operator: [''],
      fltrules: ['I'],
      flttype: ['S'],
      acnumber: ['01'],
      actype: ['', Validators.required],
      turbulence: ['M'],
      equipement: ['S'],
      departuread: ['', Validators.required],
      cruisingspeed: ['N0250'],
      aclevel: ['F100'],
      route: [''],
      destinationad: ['', Validators.required],
      totaleet: ['0000'],
      altnad1: [''],
      altnad2: [''],
      otherinfos: ['']
    });

    this.planes.push(planeGroup);
  }

  removePlane(index: number) {
    this.planes.removeAt(index);
  }

  onSubmit() {
    if (this.exerciceForm.valid) {
      console.log('Exercice Data Payload:', this.exerciceForm.getRawValue());
      alert('Exercice generated successfully with multiple planes! Check console for payload.');
      
      // Basic reset
      this.exerciceForm.reset();
      this.planes.clear();
      this.addPlane();
    } else {
      this.exerciceForm.markAllAsTouched();
    }
  }
}