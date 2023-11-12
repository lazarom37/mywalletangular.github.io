import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentsAndEarningComponent } from './payments_and_earnings.component';

describe('DashboardComponent', () => {
  let component: PaymentsAndEarningComponent;
  let fixture: ComponentFixture<PaymentsAndEarningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentsAndEarningComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentsAndEarningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
