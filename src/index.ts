import withMessage from './withMessage';

global.expect = withMessage(global.expect);

declare global {
  namespace NodeJS {
    interface Global {
      expect: jest.Expect;
    }
  }

  namespace jest {
    interface Expect {
      <T = unknown>(actual: T, message?: string): jest.JestMatchers<T>;
    }
  }
}
