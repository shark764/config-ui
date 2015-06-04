Array.prototype.removeItem = function (item) {
  var idx = this.indexOf(item);
  if (idx > -1){
    this.splice(idx, 1);
  }
};