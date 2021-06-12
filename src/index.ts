import withMessage, { ExpectWithMessage } from './withMessage';

global.expect = withMessage(global.expect);

declare global {
  namespace NodeJS {
    interface Global {
      expect: ExpectWithMessage;
    }
  }
}
