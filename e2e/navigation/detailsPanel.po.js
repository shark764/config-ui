
var DetailsPanel = function() {

  // Details Panel
  this.closePanelButton = element(by.css('#details-pane .fa-remove'));

  //Bulk Actions
  this.closeBulkPanelButton = element(by.css('bulk-action-executor .fa-remove'));
}

module.exports = new DetailsPanel();
