import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkuploadmodalComponent } from './bulkuploadmodal.component';

describe('BulkuploadmodalComponent', () => {
  let component: BulkuploadmodalComponent;
  let fixture: ComponentFixture<BulkuploadmodalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BulkuploadmodalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkuploadmodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
