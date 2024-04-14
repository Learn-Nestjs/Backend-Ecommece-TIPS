import { Test, TestingModule } from '@nestjs/testing';
import { KeyToken } from './key-token';

describe('KeyToken', () => {
  let provider: KeyToken;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KeyToken],
    }).compile();

    provider = module.get<KeyToken>(KeyToken);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
