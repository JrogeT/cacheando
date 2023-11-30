import { TestBed } from '@angular/core/testing';

import { PusherServiceService } from './pusher.service';

describe('PusherServiceService', () => {
  let service: PusherServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PusherServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
