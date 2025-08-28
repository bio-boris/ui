/* auth/utils.test */

export {}; // Make this file a module

// Mock process.env
const originalEnv = process.env;

// Create a simple test that doesn't rely on complex mocking for now
describe('makeAuthFlowURLs', () => {
  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('basic functionality', () => {
    it('should import and execute without errors', async () => {
      // Since the function depends on document.location which is complex to mock,
      // let's just import it dynamically to test the core logic paths
      const { makeAuthFlowURLs } = await import('./utils');

      // Test development mode
      Object.assign(process.env, { NODE_ENV: 'development' });

      const result = makeAuthFlowURLs('login', 'auth/continue');

      expect(result).toHaveProperty('loginOrigin');
      expect(result).toHaveProperty('actionUrl');
      expect(result).toHaveProperty('redirectUrl');
      expect(result.loginOrigin).toBe('https://ci.kbase.us');
    });

    it('should handle different target types', async () => {
      const { makeAuthFlowURLs } = await import('./utils');

      Object.assign(process.env, { NODE_ENV: 'development' });

      const loginResult = makeAuthFlowURLs('login', 'auth/continue');
      const linkResult = makeAuthFlowURLs('link', 'auth/continue');

      expect(loginResult.actionUrl).toContain('/login/start/');
      expect(linkResult.actionUrl).toContain('/link/start/');
    });

    it('should include state parameters in redirect URL', async () => {
      const { makeAuthFlowURLs } = await import('./utils');

      Object.assign(process.env, { NODE_ENV: 'development' });

      const result = makeAuthFlowURLs('login', 'auth/continue', '/some/path');

      const url = new URL(result.redirectUrl.toString());
      const state = JSON.parse(url.searchParams.get('state') || '{}');

      expect(state.nextRequest).toBe('/some/path');
      expect(state.origin).toBe('https://ci.kbase.us');
    });
  });
});
