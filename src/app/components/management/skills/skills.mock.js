'use strict';

angular.module('liveopsConfigPanel.mock.content.management.skills', ['liveopsConfigPanel.mock.content'])
  .service('mockSkills', function(Skill) {
    return [new Skill({
      'id': 'skillId1',
      'name': 'skillName1',
      'tenantId': 'tenant-id',
      'hasProficiency': true
    }), new Skill({
      'id': 'skillId2',
      'name': 'skillName2',
      'tenantId': 'tenant-id',
      'hasProficiency': false
    }), new Skill({
      'id': 'skillId3',
      'name': 'skillName3',
      'description': 'Does not exist yet!',
      'tenantId': 'tenant-id',
      'hasProficiency': false
    })];
  })
  .service('mockUserSkills', function(TenantUserSkill) {
    return [new TenantUserSkill({
      'skillId': 'skillId1',
      'tenantId': 'tenant-id',
      'userId': 'userId1',
      'proficiency': 0
    }), new TenantUserSkill({
      'skillId': 'skillId1',
      'tenantId': 'tenant-id',
      'userId': 'userId2',
      'proficiency': 5
    }), new TenantUserSkill({
      'skillId': 'skillId2',
      'tenantId': 'tenant-id',
      'userId': 'userId1',
      'proficiency': 8
    }), new TenantUserSkill({
      'skillId': 'skillId3',
      'tenantId': 'tenant-id',
      'userId': 'userId2',
      'proficiency': 10
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
        'result': [mockUserSkills[0], mockUserSkills[2]]
      });
      
      $httpBackend.when('GET', apiHostname + '/v1/tenants/tenant-id/users/userId2/skills').respond({
        'result': [mockUserSkills[1]]
      });

      //GET tenants/skills/user
      $httpBackend.when('GET', apiHostname + '/v1/tenants/tenant-id/skills/skillId1/users').respond({
        'result': [mockUserSkills[0], mockUserSkills[1]]
      });

      $httpBackend.when('GET', apiHostname + '/v1/tenants/tenant-id/skills/skillId2/users').respond({
        'result': [mockUserSkills[2]]
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
