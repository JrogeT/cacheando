import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { roomsGuard } from './rooms.guard';

describe('roomsGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => roomsGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
