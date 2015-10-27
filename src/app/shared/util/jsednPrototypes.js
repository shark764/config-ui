'use strict';

/*global jsedn: false*/

jsedn.Map.prototype.remove = function(key) {
  this.keys.splice(key, 1);
  this.vals.splice(key, 1);
};