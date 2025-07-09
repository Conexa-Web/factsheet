import { TestBed } from '@angular/core/testing';

import { EjemploServiceService } from './ejemplo-service.service';

describe('EjemploServiceService', () => {
  let service: EjemploServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EjemploServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
