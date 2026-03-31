import { TestBed } from '@angular/core/testing';

import { InternationalApiService } from './international-api.service';

describe('InternationalApiService', () => {
  let service: InternationalApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InternationalApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
