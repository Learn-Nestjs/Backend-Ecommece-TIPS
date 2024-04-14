import { Test, TestingModule } from '@nestjs/testing';
import { ShopSchema } from './shop-schema';

describe('ShopSchema', () => {
  let provider: ShopSchema;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShopSchema],
    }).compile();

    provider = module.get<ShopSchema>(ShopSchema);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
