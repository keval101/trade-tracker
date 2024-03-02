import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SheetEntryDialogComponent } from './sheet-entry-dialog.component';

describe('SheetEntryDialogComponent', () => {
  let component: SheetEntryDialogComponent;
  let fixture: ComponentFixture<SheetEntryDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SheetEntryDialogComponent]
    });
    fixture = TestBed.createComponent(SheetEntryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
