import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculateStoplossComponent } from './calculate-stoploss.component';

describe('CalculateStoplossComponent', () => {
  let component: CalculateStoplossComponent;
  let fixture: ComponentFixture<CalculateStoplossComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CalculateStoplossComponent]
    });
    fixture = TestBed.createComponent(CalculateStoplossComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
