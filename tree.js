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
      reduce    = require('mu.list.reduce');
  
  var path = function (tree, path, value) {
    var lastIndex = path.length - 1,
        last = path[lastIndex],
        write = isDefined(value);
   
    var parent = reduce(path, tree, function (acc, item, index) {
      if (index === lastIndex) { return acc; }
      if (isDefined(acc[item])) { return acc[item]; }
      
      if (write) {
        acc[item] = isNumber(path[index + 1]) ? [] : {};
        return acc[item];
      }
    });
   
    if (write) { parent[last] = value; }
    return parent[last];
  };
  
  return path;
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

define('mu.tree', function (require) {
  'use strict';

  return {
    each: require('mu.tree.each'),
    path: require('mu.tree.path'),
    map:  require('mu.tree.map')
  };
});
