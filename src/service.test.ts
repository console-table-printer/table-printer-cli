// Mock instance methods
const mockAddRow = jest.fn();
const mockPrintTable = jest.fn();

// Mock Table constructor
const MockTable = jest.fn().mockImplementation(() => ({
  addRow: mockAddRow,
  printTable: mockPrintTable
}));

// Mock modules
jest.mock('console-table-printer', () => ({
  Table: MockTable
}));

jest.mock('./inputVerifier', () => ({
  verifyInput: jest.fn(),
  verifyTableOptions: jest.fn(),
}));

import printTableFromInp from './service';
import * as inputVerifier from './inputVerifier';

describe('service', () => {
  describe('printTableFromInp', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    describe('input validation', () => {
      it('should handle invalid input', () => {
        (inputVerifier.verifyInput as jest.Mock).mockReturnValue(false);
        const input = 'invalid input';
        printTableFromInp(input);
        expect(inputVerifier.verifyInput).toHaveBeenCalledWith(input);
        expect(MockTable).not.toHaveBeenCalled();
      });

      it('should handle invalid table options', () => {
        (inputVerifier.verifyInput as jest.Mock).mockReturnValue(true);
        (inputVerifier.verifyTableOptions as jest.Mock).mockReturnValue(false);
        const input = '[{"test": "data"}]';
        const options = 'invalid options';
        printTableFromInp(input, options);
        expect(inputVerifier.verifyTableOptions).toHaveBeenCalledWith(options);
        expect(MockTable).not.toHaveBeenCalled();
      });
    });

    describe('successful printing', () => {
      beforeEach(() => {
        (inputVerifier.verifyInput as jest.Mock).mockReturnValue(true);
        (inputVerifier.verifyTableOptions as jest.Mock).mockReturnValue(true);
      });

      it('should print table without options', () => {
        const input = '[{"id": 1, "name": "test"}]';
        printTableFromInp(input);
        expect(MockTable).toHaveBeenCalledWith(undefined);
        expect(mockAddRow).toHaveBeenCalledWith({ id: 1, name: 'test' });
        expect(mockPrintTable).toHaveBeenCalled();
      });

      it('should print table with options', () => {
        const input = '[{"id": 1, "name": "test"}]';
        const options = '{"title": "Test Table"}';
        printTableFromInp(input, options);
        expect(MockTable).toHaveBeenCalledWith({ title: 'Test Table' });
        expect(mockAddRow).toHaveBeenCalledWith({ id: 1, name: 'test' });
        expect(mockPrintTable).toHaveBeenCalled();
      });

      it('should handle empty array input', () => {
        const input = '[]';
        printTableFromInp(input);
        expect(MockTable).toHaveBeenCalled();
        expect(mockAddRow).not.toHaveBeenCalled();
        expect(mockPrintTable).toHaveBeenCalled();
      });

      it('should handle complex data with options', () => {
        const input = '[{"id": 1, "data": {"nested": "value"}}]';
        const options = '{"columns": [{"name": "id", "alignment": "right"}]}';
        printTableFromInp(input, options);
        expect(MockTable).toHaveBeenCalledWith({ columns: [{ name: 'id', alignment: 'right' }] });
        expect(mockAddRow).toHaveBeenCalledWith({ id: 1, data: { nested: 'value' } });
        expect(mockPrintTable).toHaveBeenCalled();
      });
    });

    describe('edge cases', () => {
      beforeEach(() => {
        (inputVerifier.verifyInput as jest.Mock).mockReturnValue(true);
        (inputVerifier.verifyTableOptions as jest.Mock).mockReturnValue(true);
      });

      it('should handle undefined input', () => {
        printTableFromInp('' as any);
        expect(inputVerifier.verifyInput).toHaveBeenCalledWith('');
        expect(MockTable).not.toHaveBeenCalled();
      });

      it('should handle empty string input', () => {
        printTableFromInp('');
        expect(inputVerifier.verifyInput).toHaveBeenCalledWith('');
        expect(MockTable).not.toHaveBeenCalled();
      });

      it('should handle null options', () => {
        const input = '[{"test": "data"}]';
        printTableFromInp(input, undefined);
        expect(MockTable).toHaveBeenCalled();
        expect(mockAddRow).toHaveBeenCalledWith({ test: 'data' });
        expect(mockPrintTable).toHaveBeenCalled();
      });

      it('should handle empty options', () => {
        const input = '[{"test": "data"}]';
        printTableFromInp(input, '');
        expect(MockTable).toHaveBeenCalled();
        expect(mockAddRow).toHaveBeenCalledWith({ test: 'data' });
        expect(mockPrintTable).toHaveBeenCalled();
      });
    });

    describe('real world examples', () => {
      beforeEach(() => {
        (inputVerifier.verifyInput as jest.Mock).mockReturnValue(true);
        (inputVerifier.verifyTableOptions as jest.Mock).mockReturnValue(true);
      });

      it('should handle table with multiple columns and styling', () => {
        const input = '[{"id": 1, "value": 100}, {"id": 2, "value": 200}]';
        const options = '{"style": {"headerColor": "yellow"}, "columns": [{"name": "value", "color": "green"}]}';
        const expectedData = [
          { id: 1, value: 100 },
          { id: 2, value: 200 }
        ];
        const expectedOptions = {
          style: { headerColor: 'yellow' },
          columns: [{ name: 'value', color: 'green' }]
        };

        printTableFromInp(input, options);

        expect(inputVerifier.verifyInput).toHaveBeenCalledWith(input);
        expect(inputVerifier.verifyTableOptions).toHaveBeenCalledWith(options);
        expect(MockTable).toHaveBeenCalledWith(expectedOptions);
        expectedData.forEach(row => {
          expect(mockAddRow).toHaveBeenCalledWith(row);
        });
        expect(mockPrintTable).toHaveBeenCalled();
      });
    });
  });
}); 