define('mu.tree', function (require) {
  'use strict';
  
  var is   = require('mu.is'),
      list = require('mu.list');
  
  var path = function (tree, path, value) {
    var lastIndex = path.length - 1,
        last = path[lastIndex];
   
    var parent = list.reduce(path, tree, function (acc, item, index) {
      if (index === lastIndex) { return acc; }
      if (is.defined(acc[item])) { return acc[item]; }
      
      if (is.defined(value)) {
        acc[item] = is.number(path[index + 1]) ? [] : {};
        return acc[item];
      }
    });
   
    if (is.defined(value)) { parent[last] = value; }
    return parent[last];
  };
  
  var iterateTree = function (tree, func, depth) {
    depth = is.defined(depth) ? depth + 1 : 0;
    
    return list.each(tree, function (item, index) {
      var exit = func(item, index, depth);
      if (is.defined(exit)) { return exit; }
      return iterateTree(item, func, depth);
    });
  };
  
  var each = function (tree, func) {
    var path = [];
    
    return iterateTree(tree, function (item, index, depth) {
      path.length = depth;
      path[depth] = index;
      return func(item, path);
    });
  };
  
  var map = function (tree, func) {
    var mapped = is.array(list) ? [] : {};
    
    each(tree, function (item, index) {
      path(mapped, index, func(item, index));
    });
    
    return mapped;
  };

  return {
    path: path,
    each: each,
    map: map
  };
});
