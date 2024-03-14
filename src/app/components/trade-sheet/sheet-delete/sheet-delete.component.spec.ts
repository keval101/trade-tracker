import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SheetDeleteComponent } from './sheet-delete.component';

describe('SheetDeleteComponent', () => {
  let component: SheetDeleteComponent;
  let fixture: ComponentFixture<SheetDeleteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SheetDeleteComponent]
    });
    fixture = TestBed.createComponent(SheetDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
