'use strict';

Array.prototype.removeItem = function (item) {
  var idx = this.indexOf(item);
  if (idx > -1){
    this.splice(idx, 1);
  }
};

Array.prototype.clear = function() {
  this.splice(0,this.length)
}