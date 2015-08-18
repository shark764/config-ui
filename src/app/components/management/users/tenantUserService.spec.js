'use strict';

describe('TenantUser service', function(){
  var TenantUser;
  
  beforeEach(module('liveopsConfigPanel'));
  
  beforeEach(inject(['TenantUser', function(_TenantUser_) {
    TenantUser = _TenantUser_;
  }]));
});