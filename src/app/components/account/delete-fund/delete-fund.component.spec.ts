import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteFundComponent } from './delete-fund.component';

describe('DeleteFundComponent', () => {
  let component: DeleteFundComponent;
  let fixture: ComponentFixture<DeleteFundComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeleteFundComponent]
    });
    fixture = TestBed.createComponent(DeleteFundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
