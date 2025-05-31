import { isValidJson, verifyInput, verifyTableOptions } from './inputVerifier';

describe('inputVerifier', () => {
  // Mock console.error and console.log
  const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
  const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation(() => {});

  beforeEach(() => {
    // Clear mock calls before each test
    mockConsoleError.mockClear();
    mockConsoleLog.mockClear();
  });

  describe('isValidJson', () => {
    describe('valid inputs', () => {
      it('should validate empty array', () => {
        expect(isValidJson('[]')).toBe(true);
        expect(mockConsoleError).not.toHaveBeenCalled();
      });

      it('should validate array with single object', () => {
        expect(isValidJson('[{"test": "value"}]')).toBe(true);
        expect(mockConsoleError).not.toHaveBeenCalled();
      });

      it('should validate array with multiple objects', () => {
        expect(
          isValidJson(
            '[{"id": 1, "name": "test1"}, {"id": 2, "name": "test2"}]'
          )
        ).toBe(true);
        expect(mockConsoleError).not.toHaveBeenCalled();
      });

      it('should validate real-world example', () => {
        expect(
          isValidJson(
            '[{ "index":3, "text":"I would like some gelb bananen bitte", "value":200 }, { "index":4, "text":"I hope batch update is working", "value":300   } ]'
          )
        ).toBe(true);
        expect(mockConsoleError).not.toHaveBeenCalled();
      });
    });

    describe('invalid inputs', () => {
      it('should reject non-array JSON', () => {
        expect(isValidJson('{"key": "value"}')).toBe(false);
        expect(mockConsoleError).toHaveBeenCalledWith('"input" is not an array');
      });

      it('should reject malformed JSON', () => {
        expect(isValidJson('[{ "incomplete": "json"')).toBe(false);
        expect(mockConsoleLog).toHaveBeenCalledWith('Invalid JSON input');
      });

      it('should reject real-world invalid example', () => {
        expect(
          isValidJson(
            '[{ "index":3 "text":"I would like some gelb bananen bitte", "value":200 }, { "index":4, "text":"I hope batch update is working", "value":300   } ]'
          )
        ).toBe(false);
        expect(mockConsoleLog).toHaveBeenCalledWith('Invalid JSON input');
      });
    });
  });

  describe('verifyInput', () => {
    describe('valid inputs', () => {
      it('should accept empty array', () => {
        expect(verifyInput('[]')).toBe(true);
      });

      it('should accept array with one object', () => {
        expect(verifyInput('[{"test": "data"}]')).toBe(true);
      });

      it('should accept array with multiple objects', () => {
        expect(verifyInput('[{"test": "data"}, {"test2": "data2"}]')).toBe(true);
      });

      it('should accept real-world example', () => {
        expect(
          verifyInput(
            '[{ "index":3, "text":"I would like some gelb bananen bitte", "value":200 }, { "index":4, "text":"I hope batch update is working", "value":300   } ]'
          )
        ).toBe(true);
      });
    });

    describe('invalid inputs', () => {
      it('should reject empty string', () => {
        expect(verifyInput('')).toBe(false);
        expect(mockConsoleError).toHaveBeenCalledWith('Input is required');
      });

      it('should reject undefined', () => {
        expect(verifyInput(undefined as any)).toBe(false);
        expect(mockConsoleError).toHaveBeenCalledWith('Input is required');
      });

      it('should reject real-world invalid example', () => {
        expect(verifyInput('{"test": "data"}')).toBe(false);
        expect(mockConsoleError).toHaveBeenCalledWith('"input" is not an array');
      });

      it('should reject malformed JSON', () => {
        expect(verifyInput('{"test": "data"')).toBe(false);
        expect(mockConsoleLog).toHaveBeenCalledWith('Invalid JSON input');
      });
    });
  });

  describe('verifyTableOptions', () => {
    describe('valid options', () => {
      it('should accept empty object', () => {
        expect(verifyTableOptions('{}')).toBe(true);
      });

      it('should accept style options', () => {
        expect(verifyTableOptions('{"style": {"color": "red"}}')).toBe(true);
      });

      it('should accept column options', () => {
        expect(verifyTableOptions('{"columns": [{"name": "test", "color": "blue"}]}')).toBe(true);
      });

      it('should accept real-world example', () => {
        expect(
          verifyTableOptions(
            '{"style": {"headerColor": "yellow"}, "columns": [{"name": "value", "color": "green"}]}'
          )
        ).toBe(true);
      });
    });

    describe('invalid options', () => {
      it('should reject empty string', () => {
        expect(verifyTableOptions('')).toBe(false);
        expect(mockConsoleError).toHaveBeenCalledWith('Table options are required');
      });

      it('should reject undefined', () => {
        expect(verifyTableOptions(undefined as any)).toBe(false);
        expect(mockConsoleError).toHaveBeenCalledWith('Table options are required');
      });

      it('should reject malformed JSON', () => {
        expect(verifyTableOptions('{"test": "data"')).toBe(false);
        expect(mockConsoleError).toHaveBeenCalledWith('Invalid tableOptions JSON');
      });
    });
  });
}); 