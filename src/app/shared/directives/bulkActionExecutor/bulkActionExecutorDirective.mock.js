'use strict';

angular.module('liveopsConfigPanel.mock.shared.directives.bulkAction', ['liveopsConfigPanel.mock.content'])
  .service('mockBulkActions', function (BulkAction) {
    var bulkActions = [new BulkAction()];
    bulkActions[0].checked = true;
    spyOn(bulkActions[0], 'execute');
    spyOn(bulkActions[0], 'canExecute').and.returnValue(true);

    bulkActions.push(new BulkAction());
    bulkActions[1].checked = true;
    spyOn(bulkActions[1], 'execute');
    spyOn(bulkActions[1], 'canExecute').and.returnValue(false);
    
    return bulkActions;
  });