import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TradesComponent } from './trades.component';

describe('TradesComponent', () => {
  let component: TradesComponent;
  let fixture: ComponentFixture<TradesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TradesComponent]
    });
    fixture = TestBed.createComponent(TradesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
