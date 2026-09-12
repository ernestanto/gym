pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('GitHub Connection') {
            steps {
                sh 'git remote -v'
                sh 'git branch --show-current'
                sh 'git log -1 --oneline'
            }
        }

        stage('Verify Source Code') {
            steps {
                sh 'echo "GitHub source code successfully downloaded by Jenkins"'
                sh 'ls -la'
            }
        }
    }

    post {
        success {
            echo 'Jenkins successfully processed the GitHub commit!'
        }

        failure {
            echo 'Jenkins failed while processing the GitHub commit.'
        }

        always {
            echo 'GitHub → Jenkins pipeline finished.'
        }
    }
}