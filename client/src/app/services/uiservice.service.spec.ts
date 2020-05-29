import { TestBed } from '@angular/core/testing';

import { UiserviceService } from './uiservice.service';

describe('UiserviceService', () => {
  let service: UiserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UiserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
