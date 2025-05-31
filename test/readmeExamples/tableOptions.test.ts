import service from '../../src/service';

describe('Table Options Examples from README', () => {
  it('should support column-specific color and alignment', () => {
    service(
      '[{"id":1,"status":"active"},{"id":2,"status":"inactive"}]',
      '{"columns":[{"name":"status","alignment":"right","color":"green"}]}'
    );
  });

  it('should support custom table title', () => {
    service(
      '[{"id":1,"name":"John"}]',
      '{"title":"Users List"}'
    );
  });
}); 