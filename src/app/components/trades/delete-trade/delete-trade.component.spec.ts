import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteTradeComponent } from './delete-trade.component';

describe('DeleteTradeComponent', () => {
  let component: DeleteTradeComponent;
  let fixture: ComponentFixture<DeleteTradeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeleteTradeComponent]
    });
    fixture = TestBed.createComponent(DeleteTradeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
