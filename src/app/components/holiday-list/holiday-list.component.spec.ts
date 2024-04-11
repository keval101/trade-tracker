import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HolidayListComponent } from './holiday-list.component';

describe('HolidayListComponent', () => {
  let component: HolidayListComponent;
  let fixture: ComponentFixture<HolidayListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HolidayListComponent]
    });
    fixture = TestBed.createComponent(HolidayListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
