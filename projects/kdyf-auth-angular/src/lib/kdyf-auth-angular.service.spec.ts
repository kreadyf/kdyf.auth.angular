import { TestBed } from '@angular/core/testing';

import { KdyfAuthAngularService } from './kdyf-auth-angular.service';

describe('KdyfAuthAngularService', () => {
  let service: KdyfAuthAngularService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KdyfAuthAngularService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
