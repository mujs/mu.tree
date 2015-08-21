define('mu.tree.each', function (require) {
  'use strict';
  
  var isDefined = require('mu.is.defined'),
      each      = require('mu.list.each');
  
  var iterateTree = function (tree, root, func) {
    return each(tree, function (item, index) {
      var path = root.concat(index);
      var exit = func(item, path);
      if (isDefined(exit)) { return exit; }
      return iterateTree(item, path, func);
    });
  };
  
  var deepEach = function (tree, func) {
    return iterateTree(tree, [], func);
  };
  
  return deepEach;
});

define('mu.tree.path', function (require) {
  'use strict';
  
  var isDefined = require('mu.is.defined'),
      isNumber  = require('mu.is.number'),
      reduce    = require('mu.list.reduce');
  
  var path = function (tree, path, value) {
    if (!path.length) { return tree; }

    var lastIndex = path.length - 1,
        last = path[lastIndex],
        isSetter = isDefined(value);
   
    var parent = reduce(path, tree, function (acc, item, index) {
      if (!isDefined(acc)) { return; }
      if (index === lastIndex) { return acc; }
      
      if (isSetter && !isDefined(acc[item])) {
        acc[item] = isNumber(path[index + 1]) ? [] : {};
      }

      return acc[item];
    });
   
    if (isSetter) { parent[last] = value; }
    return parent && parent[last];
  };
  
  return path;
});

define('mu.tree.delete', function (require) {
  'use strict';

  var isDefined = require('mu.is.defined'),
      isScalar  = require('mu.is.scalar'),
      path      = require('mu.tree.path');

  var del = function (tree, targetPath, options) {
    options = options || {};

    var target = targetPath.pop(),
        parentPath = targetPath,
        parent = path(tree, parentPath);

    if (isDefined(parent) && !isScalar(parent)) {
      delete parent[target];
      if (options.clean && Object.keys(parent).length) {
        remove(tree, parentPath, options);
      }
    }
  };

  return del;
});

define('mu.tree.map', function (require) {
  'use strict';
  
  var isArray = require('mu.is.array'),
      each    = require('mu.tree.each'),
      path    = require('mu.tree.path');
  
  var map = function (tree, func) {
    var mapped = isArray(tree) ? [] : {};
    
    each(tree, function (item, path) {
      path(mapped, path, func(item, path));
    });
    
    return mapped;
  };
  
  return map;
});

define('mu.tree.leaves', function (require) {
  'use strict';

  var isScalar = require('mu.is.scalar'),
      each     = require('mu.tree.each');

  var leaves = function (tree, func) {
    return each(tree, function (item, path) {
      if (isScalar(item)) { return func(item, path); }
    });
  };

  return leaves;
});

define('mu.tree.copy', function (require) {
  'use strict';
  
  var map = require('mu.tree.map');
  
  var identity = function (val) { return val; };
  var copy = function (tree) { return map(tree, identity); };
  
  return copy;
});

define('mu.tree.flatten', function (require) {
  'use strict';

  var leaves = require('mu.tree.leaves');

  var flatten = function (tree) {
    var flattened = [];

    leaves(tree, function (leaf, path) {
      flattened[flattened.length] = {
        path: path,
        node: leaf
      };
    });

    return flattened;
  };

  return flatten;
});
