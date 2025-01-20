import { describe, it, expect } from 'vitest';
import { settings } from './base';
import S3ImageHosting from '../../src/index';


describe('Init S3ImageHosting', () => {
  it('should create an instance with the provided settings', () => {
    const s3 = new S3ImageHosting(settings);
    expect(s3).toBeInstanceOf(S3ImageHosting);
  });
});