import { TestBed, inject } from '@angular/core/testing';

import { DevtoolsService } from './devtools.service';

describe('DevtoolsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DevtoolsService],
    });
  });

  it(
    'should be created',
    inject([DevtoolsService], (service: DevtoolsService) => {
      expect(service).toBeTruthy();
    })
  );
});
