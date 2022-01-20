import { TestBed } from '@angular/core/testing';

import { ToDoAPIsService } from './to-do-apis.service';

describe('ToDoAPIsService', () => {
  let service: ToDoAPIsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToDoAPIsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
