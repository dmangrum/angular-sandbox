import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObservableTestsComponent } from './observable-tests.component';

describe('ObservableTestsComponent', () => {
  let component: ObservableTestsComponent;
  let fixture: ComponentFixture<ObservableTestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObservableTestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObservableTestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
