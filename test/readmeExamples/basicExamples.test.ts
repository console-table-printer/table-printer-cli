import service from '../../src/service';

describe('Basic Examples from README', () => {
  it('Original example with multiple columns and values', () => {
    service(
      '[{ "index":3, "text":"I would like some gelb bananen bitte", "value":200 }, { "index":4, "text":"I hope batch update is working", "value":300   } ]'
    );
  });

  it('Simple example with basic columns', () => {
    service(
      '[{ "id":3, "text":"like" }, {"id":4, "text":"tea"}]'
    );
  });
}); 