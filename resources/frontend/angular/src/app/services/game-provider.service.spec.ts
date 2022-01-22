import { TestBed } from '@angular/core/testing';

import { GameProviderService } from './game-provider.service';

describe('GameProviderService', () => {
  let service: GameProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
