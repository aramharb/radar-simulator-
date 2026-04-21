import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Exercice } from './exercice';

describe('Exercice', () => {
  let component: Exercice;
  let fixture: ComponentFixture<Exercice>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Exercice]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Exercice);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
