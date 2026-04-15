import { TestBed } from '@angular/core/testing';

import { DomesticapiService } from './domesticapi.service';

describe('DomesticapiService', () => {
  let service: DomesticapiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DomesticapiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
