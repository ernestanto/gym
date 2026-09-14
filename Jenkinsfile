pipeline {

    agent any

    options {
        timestamps()
        disableConcurrentBuilds()
        skipDefaultCheckout()
        buildDiscarder(logRotator(
            numToKeepStr: '10',
            daysToKeepStr: '30'
        ))
    }

    environment {
        NODE_ENV = 'production'
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm

                sh '''
                    echo "===================================="
                    echo "GitHub Repository Information"
                    echo "===================================="
                    git remote -v
                    echo "Branch:"
                    git branch --show-current
                    echo "Commit:"
                    git log -1 --oneline
                '''
            }
        }

        stage('Verify Environment') {
            steps {
                sh '''
                    echo "===================================="
                    echo "Environment Information"
                    echo "===================================="
                    echo "Node version:"
                    node --version

                    echo "NPM version:"
                    npm --version

                    echo "Git version:"
                    git --version
                '''
            }
        }

        stage('Install Dependencies') {
            steps {
                sh '''
                    echo "Installing application dependencies..."
                    npm ci
                '''
            }
        }

        stage('Test') {
            steps {
                sh '''
                    echo "Running application tests..."
                    npm test -- --watchAll=false
                '''
            }
        }

        stage('Build') {
            steps {
                sh '''
                    echo "Building Gym application..."
                    npm run build
                '''
            }
        }

        stage('Verify Build') {
            steps {
                sh '''
                    echo "Checking generated build files..."
                    test -d dist || test -d build
                    echo "Application build completed successfully."
                '''
            }
        }
    }

    post {

        success {
            echo '''
            ==========================================
            BUILD SUCCESSFUL
            ==========================================
            GitHub commit successfully processed
            by Jenkins.
            '''
        }

        failure {
            echo '''
            ==========================================
            BUILD FAILED
            ==========================================
            Check the Jenkins console output.
            '''
        }

        always {
            echo "Jenkins pipeline completed."
        }
    }
}