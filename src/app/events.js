'use strict';

angular.module('liveopsConfigPanel')
  .constant('loEvents', {
    tableControls: {
      itemSelected: 'table:resource:selected',
      itemChecked: 'table:resource:checked',
      itemCreate: 'table:resource:create',
      actions: 'table:click:actions',
      altClose: 'table:panel:altClose'
    },
    bulkActions: {
      close: 'details:panel:close'
    },
    state: {
      changeCanceled: 'loStateChangeCanceled'
    }
  });
