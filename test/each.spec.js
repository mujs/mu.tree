describe('each', function () {
  var each     = require('mu.tree.each'),
      isScalar = require('mu.is.scalar');

  var tree = {
    a: 'a',
    b: { a: 'ba', b: 'bb' },
    c: [ 'c0', 'c1' ],
    d: 'd'
  };

  it('should traverse objects in depth', function () {
    var values = [];

    each(tree, function (item) {
      if (isScalar(item)) { values.push(item); }
    });

    expect(values).toEqual([
      'a',
      'ba',
      'bb',
      'c0',
      'c1',
      'd'
    ]);
  });

  it('should provide a unique path for each node', function () {
    var paths = [];

    each(tree, function (item, path) {
      if (isScalar(item)) { paths.push(path); }
    });

    expect(paths).toEqual([
      ['a'],
      ['b', 'a'],
      ['b', 'b'],
      ['c', 0],
      ['c', 1],
      ['d']
    ]);
  });
});
