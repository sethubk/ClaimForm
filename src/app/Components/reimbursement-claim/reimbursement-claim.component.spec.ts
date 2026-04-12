import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReimbursementClaimComponent } from './reimbursement-claim.component';

describe('ReimbursementClaimComponent', () => {
  let component: ReimbursementClaimComponent;
  let fixture: ComponentFixture<ReimbursementClaimComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReimbursementClaimComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReimbursementClaimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
