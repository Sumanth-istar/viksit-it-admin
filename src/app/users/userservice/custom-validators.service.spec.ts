import { TestBed, inject } from '@angular/core/testing';

import { CustomValidatorsService } from './custom-validators.service';

describe('CustomValidatorsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CustomValidatorsService]
    });
  });

  it('should be created', inject([CustomValidatorsService], (service: CustomValidatorsService) => {
    expect(service).toBeTruthy();
  }));
});
