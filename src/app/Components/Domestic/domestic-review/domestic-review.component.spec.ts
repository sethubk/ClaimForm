import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DomesticReviewComponent } from './domestic-review.component';

describe('DomesticReviewComponent', () => {
  let component: DomesticReviewComponent;
  let fixture: ComponentFixture<DomesticReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DomesticReviewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DomesticReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
