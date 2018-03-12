import { UtilityServiceProvider } from './utility-service';

describe('Service: Utility', () => {
  let service: UtilityServiceProvider;

  beforeEach(() => {
    service = new UtilityServiceProvider();
  });

  afterEach(() => {
    service = null;
  });

  it('should return a proper hex value based on the email address', () => {
    const email = 'jeffminsungkim@gmail.com';
    expect(service.convertEmailToHash(email)).toBe('ef869a3ccaa1070303cf9e036d370723');
  });

  it('should return true when the string starts with the certain text', () => {
    const username = 'user448372';
    const searchValue = 'user';
    expect(service.isStringStartsWith(username, searchValue)).toBeTruthy();
  });

  it('should return false when the string starts with the certain text', () => {
    const username = 'ex448user372';
    const searchValue = 'user';
    expect(service.isStringStartsWith(username, searchValue)).toBeFalsy();
  });

});
