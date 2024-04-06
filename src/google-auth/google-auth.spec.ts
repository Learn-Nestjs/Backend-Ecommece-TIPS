import { Test, TestingModule } from '@nestjs/testing';
import { GoogleAuth } from './google-auth';

describe('GoogleAuth', () => {
  let provider: GoogleAuth;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GoogleAuth],
    }).compile();

    provider = module.get<GoogleAuth>(GoogleAuth);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
