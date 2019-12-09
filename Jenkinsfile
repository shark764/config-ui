#!groovy​
@Library('sprockets@2.9.4') _

import common
import git
import hipchat
import node
import frontend

def service = 'Config-UI'
def docker_tag = BUILD_TAG.toLowerCase()
def pr = env.CHANGE_ID
def c = new common()
def n = new node()
def f = new frontend()

def commiter = ''
def lastCommitMsg = ''

//This will stop all old builds so that things are not running in parallel.
c.stop_previous_builds(env.JOB_NAME, env.BUILD_NUMBER.toInteger())

node(){
  pwd = pwd()
}

pipeline {
  agent any
  stages {
    stage ('Set build version') {
      steps {
        sh 'echo "Stage Description: Set build version from package.json"'
        script {
          n.export()
          build_version = readFile('version')
          buildTool = c.getBuildTool()
          props = c.exportProperties(buildTool)
          sh "git log -2 --pretty=%B > lastCommitMsg"
          lastCommitMsg = readFile('lastCommitMsg').trim()
          sh "git log -2 --pretty=format:'%an' > commiter"
          commiter = readFile('commiter').trim()
        }
      }
    }
    stage ('Setup Docker') {
      steps {
        sh 'echo "Stage Description: Sets up docker image for use in the next stages"'
        sh "rm -rf ${pwd}/build || true"        
        sh "mkdir build -p"
        sh "docker build -t ${docker_tag} -f Dockerfile ."
        sh "docker run --rm -t -d --name=${docker_tag} --mount type=bind,src=$HOME/.ssh,dst=/home/node/.ssh,readonly --mount type=bind,src=${pwd}/build,dst=/home/node/mount ${docker_tag}"
        sh "docker exec ${docker_tag} bower install"
      }
    }
    // Commented out for now untill we fix existing linter errors
    // TODO: fix existing linter errors
    // stage ('Lint for errors') {
    //   when { changeRequest() }
    //   steps {
    //     sh 'echo "Stage Description: Lints the project for common js errors and formatting"'
    //     sh "docker exec ${docker_tag} npm run lint"
    //   }
    // }
    // Unit tests were removed when we switched to dockerized builds
    // TODO: We need to test that they still work / fix them and add them back in here...
    // we probably wont both with junit report for config-ui , we'll just make existing tests pass
    // stage ('Unit Tests') {
    //   when { changeRequest() }
    //   steps {
    //     sh 'echo "Stage Description: Runs unit tests and fails if they do not pass"'
    //     sh "docker exec ${docker_tag} npm run test"
    //     sh "docker cp ${docker_tag}:/home/node/app/junit.xml build"
    //     junit 'build/junit.xml'
    //   }
    // }
    stage ('Build') {
      steps {
        sh 'echo "Stage Description: Builds the production version of the app"'
        sh "docker exec ${docker_tag} npm run build"
        sh "docker cp ${docker_tag}:/home/node/app/dist build"
      }
    }
    stage ('Preview PR (dev)') {
      when { changeRequest() }
      steps {
        sh 'echo "Stage Description: Creates a temp build of the site in dev to review the changes"'
        sh "aws s3 rm s3://frontend-prs.cxengagelabs.net/config-ui/${pr}/ --recursive"
        sh "aws s3 sync build/dist/ s3://frontend-prs.cxengagelabs.net/config-ui/${pr}/ --delete"
        script {
          f.invalidate("E23K7T1ARU8K88")
        }
      }
    }
    stage ('Ready for QE?') {
      when { changeRequest() }
      steps {
        timeout(time: 5, unit: 'DAYS') {
          script {
            input message: 'Ready for QE?', submittedParameter: 'submitter'
            sh 'echo "Stage Description: Makes temp verion of the app pointing to qe env"'
            def config = 'build/dist/app/env.js'
            sh "find -name vendor-*.js > commandResult"
            def vendor = readFile('commandResult').trim()
            sh "aws s3 rm s3://frontend-prs.cxengagelabs.net/config-ui/${pr}/ --recursive"
            sh "sed -i 's/dev/qe/g' ${config}"
            sh "chmod 644 ${vendor}"
            sh "sed -i 's/dev-api.cxengagelabs.net/qe-api.cxengagelabs.net/g' ${vendor}"
            sh "aws s3 sync build/dist/ s3://frontend-prs.cxengagelabs.net/config-ui/${pr}/ --delete"
          }
          script {
            f.invalidate("E23K7T1ARU8K88")
          }
        }
      }
    }
    stage ('QE Approval?') {
      when { changeRequest() }
      steps {
        timeout(time: 5, unit: 'DAYS') {
          script {
            input message: 'Testing complete?', submittedParameter: 'submitter'
          }
        }
      }
    }
    stage ('Github tagged release') {
      when { anyOf {branch 'master'; branch 'develop'; branch 'release'; branch 'hotfix'}}
      steps {
        sh 'echo "Makes a github tagged release under a new branch with the same name as the tag version"'
        git url: "git@github.com:SerenovaLLC/${service}", branch: "${BRANCH_NAME}"
        sh 'git checkout -b build-${BUILD_TAG}'
        script {
          if (build_version.contains("SNAPSHOT")) {
            sh "if git tag --list | grep ${build_version}; then git tag -d ${build_version}; git push origin :refs/tags/${build_version}; fi"
          }
        }
        sh "git tag -a ${build_version} -m 'release ${build_version}, Jenkins tagged ${BUILD_TAG}'"
        sh "git push origin ${build_version}"
      }
    }
    stage ('Store in S3') {
      when { anyOf {branch 'master'; branch 'develop'; branch 'release'; branch 'hotfix'}}
      steps {
        sh 'echo "Stage Description: Syncs a copy of the build folder to > s3://cxengagelabs-jenkins/frontend/{{service}}/{{version}}/"'
        sh "aws s3 sync build/dist s3://cxengagelabs-jenkins/frontend/${service}/${build_version}/ --delete"

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
  }
  post {
    always {
      sh "docker rmi ${docker_tag} --force"
      script {
        c.cleanup()
      }
    }
    success {
      script {
        def jobType = 'hipchat message goes here based on jenkins job type'
        def notifyPpl = 'ppl to @ in hipchat that should action this notification'
        if (env.BRANCH_NAME == "master") {
        } else {
          sh "echo 'No notification needed'"
        }
      }
    }
    failure {
      script {
        echo 'Script Failed'
      }
    }
    unstable {
        echo 'This will run only if the run was marked as unstable'
    }
    changed {
        echo 'This will run only if the state of the Pipeline has changed'
        echo 'For example, if the Pipeline was previously failing but is now successful'
    }
  }
}
