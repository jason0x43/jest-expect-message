import 'jest-extended';
import './index';

describe('jest-expect-message', () => {
  test('should fail with custom message', () => {
    expect(() =>
      expect(false, 'Woah this should be false!').toBeTruthy()
    ).toThrowErrorMatchingSnapshot();
  });

  test('should fail without custom message', () => {
    expect(() => expect(false).toBeTruthy()).toThrowErrorMatchingSnapshot();
  });

  test('should pass when given custom message', () => {
    expect(1, 'should have been 1').toBe(1);
  });

  test('should pass when not given custom message', () => {
    expect(1).toBe(1);
  });

  describe('supports custom matchers registered after jest-expect-message', () => {
    expect.extend({
      toBeDivisibleBy(received, argument) {
        const pass = received % argument == 0;
        const message = pass
          ? () => `expected ${received} not to be divisible by ${argument}`
          : () => `expected ${received} to be divisible by ${argument}`;
        return { message, pass };
      },
    });

    interface ExtendedAsymmetricMatchers
      extends jest.InverseAsymmetricMatchers {
      toBeDivisibleBy(num: number): void;
    }

    interface ExtendedJestMatchers<R> extends jest.Matchers<R> {
      toBeDivisibleBy(num: number): void;
      not: ExtendedAsymmetricMatchers;
    }

    interface ExtendedExpect extends jest.Expect {
      <T = any>(actual: T, customMessage?: string): ExtendedJestMatchers<T>;
      toBeDivisibleBy(num: number): void;
      not: ExtendedAsymmetricMatchers;
    }

    const extendedExpect = expect as ExtendedExpect;

    it('allows new custom matchers to use custom messages', () => {
      expect(() =>
        extendedExpect(100, '100 % 3 === 1').toBeDivisibleBy(3)
      ).toThrowErrorMatchingSnapshot();
      expect(() =>
        extendedExpect(101, '101 % 1 === 0').not.toBeDivisibleBy(1)
      ).toThrowErrorMatchingSnapshot();
    });

    it('supports custom asymmetric matchers', () => {
      expect({ apples: 6, bananas: 3 }).toEqual({
        apples: extendedExpect.toBeDivisibleBy(1),
        bananas: extendedExpect.not.toBeDivisibleBy(2),
      });
    });
  });
});
