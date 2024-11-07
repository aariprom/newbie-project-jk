import { Test, TestingModule } from '@nestjs/testing';
import { DietService } from './diet.service';

describe('DietService', () => {
  let service: DietService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DietService],
    }).compile();

    service = module.get<DietService>(DietService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
