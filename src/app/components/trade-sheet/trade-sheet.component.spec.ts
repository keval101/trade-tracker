import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TradeSheetComponent } from './trade-sheet.component';

describe('TradeSheetComponent', () => {
  let component: TradeSheetComponent;
  let fixture: ComponentFixture<TradeSheetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TradeSheetComponent]
    });
    fixture = TestBed.createComponent(TradeSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
