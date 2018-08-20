import { TestBed, inject } from '@angular/core/testing';

import { GroupserviceService } from './groupservice.service';

describe('GroupserviceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GroupserviceService]
    });
  });

  it('should be created', inject([GroupserviceService], (service: GroupserviceService) => {
    expect(service).toBeTruthy();
  }));
});
