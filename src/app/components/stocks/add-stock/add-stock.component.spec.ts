import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddStockComponent } from './add-stock.component';

describe('AddStockComponent', () => {
  let component: AddStockComponent;
  let fixture: ComponentFixture<AddStockComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddStockComponent]
    });
    fixture = TestBed.createComponent(AddStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
