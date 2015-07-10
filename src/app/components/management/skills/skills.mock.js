'use strict';

angular.module('liveopsConfigPanel.mock.content.management.skills', ['liveopsConfigPanel.mock.content'])
  .service('mockSkills', function(Skill) {
    return [new Skill({
      'id': 'skillId1',
      'name': 'skillName1',
      'tenantId': 'tenant-id'
    }), new Skill({
      'id': 'skillId2',
      'name': 'skillName2',
      'tenantId': 'tenant-id'
    }), new Skill({
      'id': 'skillId3',
      'name': 'skillName3',
      'description': 'Does not exist yet!',
      'tenantId': 'tenant-id'
    })];
  })
  .service('mockUserSkills', function(TenantUserSkills) {
    return [new TenantUserSkills({
      'skillId': 'skillId1',
      'memberId': 'userId1'
    }), new TenantUserSkills({
      'skillId': 'skillId2',
      'memberId': 'userId1'
    }), new TenantUserSkills({
      'skillId': 'skillId3',
      'memberId': 'userId1'
    })];
  })
  .run(['$httpBackend', 'apiHostname', 'mockSkills', 'mockUserSkills',
    function($httpBackend, apiHostname, mockSkills, mockUserSkills) {
      //GET tenants/skills
      $httpBackend.when('GET', apiHostname + '/v1/tenants/tenant-id/skills').respond({
        'result': [mockSkills[0], mockSkills[1]]
      });
      
      $httpBackend.when('GET', apiHostname + '/v1/tenants/tenant-id/skills/skillId1').respond({
        'result': mockSkills[0]
      });

      $httpBackend.when('GET', apiHostname + '/v1/tenants/tenant-id/skills/skillId2').respond({
        'result': mockSkills[1]
      });

      //GET tenants/user/skills
      $httpBackend.when('GET', apiHostname + '/v1/tenants/tenant-id/users/userId1/skills').respond({
        'result': [mockUserSkills[0], mockUserSkills[1]]
      });
      
      //GET tenants/skills/user
      $httpBackend.when('GET', apiHostname + '/v1/tenants/tenant-id/skills/skillId2/users').respond({
        'result': []
      });
      
      
      //POST tenants/skills
      $httpBackend.when('POST', apiHostname + '/v1/tenants/tenant-id/skills').respond({
        'result': mockSkills[2]
      });
      
      //POST tenants/users/skills
      $httpBackend.when('POST', apiHostname + '/v1/tenants/tenant-id/users/userId1/skills').respond({
        'result': mockUserSkills[2]
      });
      
      //DELETE tenants/users/skills
      $httpBackend.when('DELETE', apiHostname + '/v1/tenants/tenant-id/users/userId1/skills/skillId1').respond(200);
    
      //PUT tenants/users/skills
      $httpBackend.when('PUT', apiHostname + '/v1/tenants/tenant-id/users/userId1/skills/skillId1').respond({
        'result': mockUserSkills[0]
      });
    }
  ]);
