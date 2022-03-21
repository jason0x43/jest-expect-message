interface HasMessage {
  message: string | (() => string);
}

class JestAssertionError extends Error {
  matcherResult: HasMessage;

  constructor(result: HasMessage, callsite: Function) {
    const { message } = result;
    super(typeof message === 'function' ? message() : message);

    this.matcherResult = result;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, callsite);
    }
  }
}

function wrapMatcher<
  T extends (...args: any[]) => any,
  R,
  M extends jest.CustomJestMatcher<T, R>
>(matcher: M, customMessage?: string) {
  return function newMatcher(
    this: jest.MatcherContext,
    ...args: jest.RemoveFirstFromTuple<Parameters<T>>
  ) {
    try {
      return matcher(...args);
    } catch (error) {
      if (typeof customMessage !== 'string' || customMessage.length < 1) {
        throw error;
      }

      const matcherResult = error?.matcherResult ?? error;

      const resultMessage =
        typeof matcherResult.message === 'function'
          ? matcherResult.message()
          : matcherResult.message;

      const message = () => customMessage + '\n\n' + resultMessage;

      throw new JestAssertionError({ ...matcherResult, message }, newMatcher);
    }
  };
}

function wrapMatchers<R, T extends (...args: any[]) => any>(
  matchers: jest.Matchers<R, T>,
  customMessage?: string
): jest.Matchers<R, T> {
  const wrapped: Record<string, any> = {};
  for (const name in matchers) {
    const matcher = (matchers as unknown as Record<string, any>)[name]!;
    wrapped[name] =
      typeof matcher === 'function'
        ? wrapMatcher(matcher, customMessage)
        : wrapMatchers(matcher, customMessage);
  }
  return wrapped as unknown as jest.Matchers<R, T>;
}

export default function (expect: jest.Expect): jest.Expect {
  // proxy the expect function
  let expectProxy = Object.assign(
    // partially apply expect to get all matchers and chain them
    (actual: jest.CustomMatcher, customMessage: string) =>
      wrapMatchers(expect(actual), customMessage),
    // clone additional properties on expect
    expect
  );

  expectProxy.extend = (o) => {
    expect.extend(o); // add new matchers to expect
    expectProxy = Object.assign(expectProxy, expect); // clone new asymmetric matchers
  };

  return expectProxy;
}

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
