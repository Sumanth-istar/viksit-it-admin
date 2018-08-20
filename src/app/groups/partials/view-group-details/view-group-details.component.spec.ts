import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewGroupDetailsComponent } from './view-group-details.component';

describe('ViewGroupDetailsComponent', () => {
  let component: ViewGroupDetailsComponent;
  let fixture: ComponentFixture<ViewGroupDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewGroupDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewGroupDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
