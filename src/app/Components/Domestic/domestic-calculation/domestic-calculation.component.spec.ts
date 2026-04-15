import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DomesticCalculationComponent } from './domestic-calculation.component';

describe('DomesticCalculationComponent', () => {
  let component: DomesticCalculationComponent;
  let fixture: ComponentFixture<DomesticCalculationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DomesticCalculationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DomesticCalculationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
