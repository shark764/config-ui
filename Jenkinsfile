#!groovy​
@Library('sprockets@2.1.0') _

import common
import git
import hipchat
import node
import frontend

def service = 'Config-UI'
def docker_tag = BUILD_TAG.toLowerCase()
def pr = env.CHANGE_ID
def c = new common()
def h = new hipchat()
def n = new node()
def f = new frontend()

@NonCPS
def stop_previous_builds(job_name, build_num) {
  def job = Jenkins.instance.getItemByFullName(job_name)
  def new_builds = job.getNewBuilds()

  for (int i = 0; i < new_builds.size(); i++) {
    def build = new_builds.get(i);
    if (build.getNumber().toInteger() != build_num) {
      if (build.isBuilding()) {
        build.doStop()
      }
    }
  }
}

try {
  stop_previous_builds(env.JOB_NAME, env.BUILD_NUMBER.toInteger())
} catch (Exception e) {}

node(){
  pwd = pwd()
}

pipeline {
  agent any
  stages {
    stage ('Export Properties') {
      steps {
        script {
          n.export()
          build_version = readFile('version')
          c.setDisplayName("${build_version}")
        }
      }
    }
    stage ('Test && Build') {
      steps {
        sh "mkdir dist"
        sh "docker build -t ${docker_tag} -f Dockerfile-build ."
        sh "docker run --rm --mount type=bind,src=$HOME/.ssh,dst=/home/node/.ssh,readonly --mount type=bind,src=${pwd}/dist,dst=/home/node/mount ${docker_tag}"
      }
    }
    stage ('Preview PR') {
      when { changeRequest() }
      steps {
        sh "aws s3 rm s3://frontend-prs.cxengagelabs.net/config-ui/${pr}/ --recursive"
        sh "sed -i 's/\\\"\\/main/\\\"\\/config-ui\\/${pr}\\/main/g' dist/index.html"
        sh "mv dist/config_pr.json dist/config.json"
        sh "aws s3 sync dist/ s3://frontend-prs.cxengagelabs.net/config-ui/${pr}/ --delete"
        script {
          f.invalidate("E23K7T1ARU8K88")
          hipchatSend(color: 'GRAY',
                      credentialId: 'HipChat-API-Token',
                      message: "<a href=\"${pullRequest.url}\"><b>${service}#${pr} - ${pullRequest.title} (${pullRequest.createdBy}) is ready for review</b></a> <br/> <a href=\"${BUILD_URL}\">Link to Build</a> <br/><a href=\"https://frontend-prs.cxengagelabs.net/config-ui/${pr}/index.html\">Config-Ui Dev Preview</a>",
                      notify: true,
                      room: 'frontendprs',
                      sendAs: 'Jenkins',
                      server: 'api.hipchat.com',
                      textFormat: false,
                      v2enabled: false)
        }
      }
    }
    stage ('Ready for QE') {
      when { changeRequest() }
      steps {
        timeout(time: 5, unit: 'DAYS') {
          script {
            input message: 'Ready for QE?', submittedParameter: 'submitter'
          }
          sh "aws s3 rm s3://frontend-prs.cxengagelabs.net/config-ui/${pr}/ --recursive"
          sh "sed -i 's/dev/qe/g' dist/config.json"
          sh "aws s3 sync dist/ s3://frontend-prs.cxengagelabs.net/config-ui/${pr}/ --delete"
          script {
            f.invalidate("E23K7T1ARU8K88")
            hipchatSend(color: 'YELLOW',
                        credentialId: 'HipChat-API-Token',
                        message: "<a href=\"${pullRequest.url}\"><b>${service}#${pr} - ${pullRequest.title} (${pullRequest.createdBy}) is ready for QE</b></a> <br/> <a href=\"${BUILD_URL}\">Link to Build</a> <br/><a href=\"https://frontend-prs.cxengagelabs.net/config-ui/${pr}/index.html\">Config-Ui Dev Preview</a>",
                        notify: true,
                        room: 'frontendprs',
                        sendAs: 'Jenkins',
                        server: 'api.hipchat.com',
                        textFormat: false,
                        v2enabled: false)
          }
        }
      }
    }
    stage ('QE Approval') {
      when { changeRequest() }
      steps {
        timeout(time: 5, unit: 'DAYS') {
          script {
            input message: 'Testing complete?', submittedParameter: 'submitter'
            hipchatSend(color: 'GREEN',
                        credentialId: 'HipChat-API-Token',
                        message: "<a href=\"${pullRequest.url}\"><b>${service}#${pr} - ${pullRequest.title} (${pullRequest.createdBy}) is ready to be merged</b></a> <br/> <a href=\"${BUILD_URL}\">Link to Build</a>",
                        notify: true,
                        room: 'frontendprs',
                        sendAs: 'Jenkins',
                        server: 'api.hipchat.com',
                        textFormat: false,
                        v2enabled: false)
          }
        }
      }
    }
    stage ('Push to Github') {
      when { anyOf {branch 'master'; branch 'develop'; branch 'release'; branch 'hotfix'}}
      steps {
        git url: "git@github.com:SerenovaLLC/${service}"
        sh 'git checkout -b build-${BUILD_TAG}'
        sh 'git add -f dist/* '
        sh "git commit -m 'release ${build_version}'"
        script {
          if (build_version.contains("SNAPSHOT")) {
            sh "if git tag --list | grep ${build_version}; then git tag -d ${build_version}; git push origin :refs/tags/${build_version}; fi"
          }
        }
        sh "git tag -a ${build_version} -m 'release ${build_version}, Jenkins tagged ${BUILD_TAG}'"
        sh "git push origin ${build_version}"
      }
    }
    stage ('Push to S3') {
      when { anyOf {branch 'master'; branch 'develop'; branch 'release'; branch 'hotfix'}}
      steps {
        script {
          sh "aws s3 sync ./dist/ s3://cxengagelabs-jenkins/frontend/${service}/${build_version}/ --delete"
          // n.push("${service}", "${build_version}")
        }
      }
    }
    stage ('Deploy') {
      when { anyOf {branch 'master'; branch 'develop'; branch 'release'; branch 'hotfix'}}
      steps {
        script {
          f.pull("${service}", "${build_version}") // pull down version of site from s3
          f.versionFile("${build_version}") // make version file
          f.confFile("dev", "${build_version}") // make conf file
          f.deploy("dev","config") // push to s3
          f.invalidate("E3MJXQEHZTM4FB") // invalidate cloudfront
          h.hipchatDeployServiceSuccess("${service}", "dev", "${build_version}", "${env.BUILD_USER}")
        }
      }
    }
    stage ('Notify Success') {
      steps {
        script {
          h.hipchatPullRequestSuccess("${service}", "${build_version}")
        }
      }
    }
  }
  post {
    failure {
      script {
        h.hipchatPullRequestFailure("${service}", "${build_version}")
      }
    }
    always {
      script {
        c.cleanup()
      }
      sh "docker rmi ${docker_tag}"
    }
  }
}
