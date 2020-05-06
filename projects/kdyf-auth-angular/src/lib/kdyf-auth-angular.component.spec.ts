import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KdyfAuthAngularComponent } from './kdyf-auth-angular.component';

describe('KdyfAuthAngularComponent', () => {
  let component: KdyfAuthAngularComponent;
  let fixture: ComponentFixture<KdyfAuthAngularComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KdyfAuthAngularComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KdyfAuthAngularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
