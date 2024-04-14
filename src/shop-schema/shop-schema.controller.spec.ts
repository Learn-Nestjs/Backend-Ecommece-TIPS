import { Test, TestingModule } from '@nestjs/testing';
import { ShopSchemaController } from './shop-schema.controller';

describe('ShopSchemaController', () => {
  let controller: ShopSchemaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShopSchemaController],
    }).compile();

    controller = module.get<ShopSchemaController>(ShopSchemaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
