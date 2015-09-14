
var DetailsPanel = function() {

  // Details Panel
  this.closePanelButton = element(by.id('close-details-button'));

  //Bulk Actions
  this.closeBulkPanelButton = element(by.id('close-bulk-button'));
}

module.exports = new DetailsPanel();
