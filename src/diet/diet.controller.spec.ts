import { Test, TestingModule } from '@nestjs/testing';
import { DietController } from './diet.controller';
import { DietService } from './diet.service';

describe('DietController', () => {
  let controller: DietController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DietController],
      providers: [DietService],
    }).compile();

    controller = module.get<DietController>(DietController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
