define('mu.tree', function (require) {
  'use strict';
  
  var list = require('mu.list'),
      is   = require('mu.is');
  
  var deepEach = function (tree, func, depth) {
    depth = is.defined(depth) ? depth + 1 : 0;
    
    return list.each(tree, function (item, index) {
      var exit = func(item, index, depth);
      if (is.defined(exit)) { return exit; }
      return deepEach(item, func, depth);
    });
  };
  
  var each = function (tree, func) {
    var path = [];
    
    return deepEach(tree, function (item, index, depth) {
      path.length = depth;
      path[depth] = index;
      return func(item, path);
    });
  };
  
  var path = function (tree, path, value) {
    var lastIndex = path.length - 1,
        last = path[lastIndex];
   
    var parent = list.reduce(path, tree, function (acc, item, index) {
      if (index === lastIndex) { return acc; }
      if (is.defined(acc[item])) { return acc[item]; }
      
      if (is.defined(value)) {
        return acc[item] = is.number(path[index + 1]) ? [] : {};
      }
    });
   
    if (is.defined(value)) { parent[last] = value; }
    return parent[last];
  };
  
  return {
    each: each,
    path: path
  };
});
