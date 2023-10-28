import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecurringPaymentsAndEarningsComponent } from './recurring_payments_and_earnings.component';

describe('DashboardComponent', () => {
  let component: RecurringPaymentsAndEarningsComponent;
  let fixture: ComponentFixture<RecurringPaymentsAndEarningsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecurringPaymentsAndEarningsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecurringPaymentsAndEarningsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
