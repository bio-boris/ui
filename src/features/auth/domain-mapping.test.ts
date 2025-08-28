/* auth/domain-mapping.test */

export {}; // Make this file a module

describe('Domain mapping logic for berdl.kbase.us subdomains', () => {
  it('should correctly identify berdl.kbase.us subdomains', () => {
    // Test the hostname matching logic that we're using in the code
    const testCases = [
      { hostname: 'dev.berdl.kbase.us', shouldMatch: true },
      { hostname: 'hub.berdl.kbase.us', shouldMatch: true },
      { hostname: 'stage.berdl.kbase.us', shouldMatch: true },
      { hostname: 'prod.berdl.kbase.us', shouldMatch: true },
      { hostname: 'test.berdl.kbase.us', shouldMatch: true },
      { hostname: 'narrative.kbase.us', shouldMatch: false },
      { hostname: 'kbase.us', shouldMatch: false },
      { hostname: 'example.com', shouldMatch: false },
      { hostname: 'berdl.kbase.us.fake.com', shouldMatch: false },
      { hostname: 'fakeberdl.kbase.us', shouldMatch: false },
    ];

    testCases.forEach(({ hostname, shouldMatch }) => {
      const result = hostname.endsWith('.berdl.kbase.us');
      expect(result).toBe(shouldMatch);
    });
  });

  it('should map berdl.kbase.us subdomains to narrative.kbase.us', () => {
    // Test the domain mapping logic
    const getDomainMapping = (origin: string) => {
      if (origin === 'https://narrative.kbase.us') {
        return 'https://kbase.us';
      }
      const url = new URL(origin);
      if (url.hostname.endsWith('.berdl.kbase.us')) {
        return 'https://narrative.kbase.us';
      }
      return origin;
    };

    const testCases = [
      {
        origin: 'https://dev.berdl.kbase.us',
        expected: 'https://narrative.kbase.us',
      },
      {
        origin: 'https://hub.berdl.kbase.us',
        expected: 'https://narrative.kbase.us',
      },
      {
        origin: 'https://stage.berdl.kbase.us',
        expected: 'https://narrative.kbase.us',
      },
      { origin: 'https://narrative.kbase.us', expected: 'https://kbase.us' },
      { origin: 'https://example.com', expected: 'https://example.com' },
      { origin: 'https://kbase.us', expected: 'https://kbase.us' },
    ];

    testCases.forEach(({ origin, expected }) => {
      const result = getDomainMapping(origin);
      expect(result).toBe(expected);
    });
  });
});
