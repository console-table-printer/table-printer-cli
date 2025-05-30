import service from '../src/service';


describe('Testing Examples from README', () => {
  it('Original example', () => {
    service(
      '[{ "index":3, "text":"I would like some gelb bananen bitte", "value":200 }, { "index":4, "text":"I hope batch update is working", "value":300   } ]'
    );
  });

  it('Basic Example', () => {
    service(
      '[{ "id":3, "text":"like" }, {"id":4, "text":"tea"}]'
    );
  });
});


describe('Using Table Options Examples', () => {
  it('Example 1: Table with column-specific color and alignment', () => {
    service(
      '[{"id":1,"status":"active"},{"id":2,"status":"inactive"}]',
      '{"columns":[{"name":"status","alignment":"right","color":"green"}]}'
    );
  });

  it('Example 2: Table with custom title', () => {
    service(
      '[{"id":1,"name":"John"}]',
      '{"title":"Users List"}'
    );
  });
});

