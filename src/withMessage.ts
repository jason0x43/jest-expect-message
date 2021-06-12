export interface ExpectWithMessage extends jest.Expect {
  <T = any>(actual: T, message?: string): jest.JestMatchers<T>;
}

class JestAssertionError extends Error {
  matcherResult: jest.CustomMatcherResult;

  constructor(result: jest.CustomMatcherResult, callsite: Function) {
    super(result.message());
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
      if (!error.matcherResult) {
        throw error;
      }
      const { matcherResult } = error;

      if (typeof customMessage !== 'string' || customMessage.length < 1) {
        throw new JestAssertionError(matcherResult, newMatcher);
      }

      const message = () =>
        'Custom message:\n  ' +
        customMessage +
        '\n\n' +
        matcherResult.message();

      throw new JestAssertionError({ ...matcherResult, message }, newMatcher);
    }
  };
}

function wrapMatchers<R, T>(
  matchers: jest.Matchers<R, T>,
  customMessage?: string
): jest.Matchers<R, T> {
  return Object.keys(matchers).reduce(
    (allMatchers, name) => {
      const matcher = matchers[name as keyof typeof matchers];

      if (typeof matcher === 'function') {
        return {
          ...allMatchers,
          [name]: wrapMatcher(matcher, customMessage)
        };
      }

      return {
        ...allMatchers,
        // recurse on .not/.resolves/.rejects
        [name]: wrapMatchers(matcher, customMessage)
      };
    },
    {} as jest.Matchers<R, T>
  );
}

export default function(expect: jest.Expect): ExpectWithMessage {
  // proxy the expect function
  let expectProxy = Object.assign(
    // partially apply expect to get all matchers and chain them
    (actual: jest.CustomMatcher, customMessage: string) =>
      wrapMatchers(expect(actual), customMessage),
    // clone additional properties on expect
    expect
  );

  expectProxy.extend = o => {
    expect.extend(o); // add new matchers to expect
    expectProxy = Object.assign(expectProxy, expect); // clone new asymmetric matchers
  };

  return expectProxy;
}
