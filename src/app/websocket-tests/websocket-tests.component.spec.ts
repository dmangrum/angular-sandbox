import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WebsocketTestsComponent } from './websocket-tests.component';

describe('WebsocketTestsComponent', () => {
  let component: WebsocketTestsComponent;
  let fixture: ComponentFixture<WebsocketTestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WebsocketTestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WebsocketTestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
