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

    stages {

        stage('Checkout') {
            steps {
                checkout scm

                sh '''
                    echo "===================================="
                    echo "GitHub Repository Information"
                    echo "===================================="

                    git remote -v

                    echo "Commit:"
                    git log -1 --oneline

                    echo "Files:"
                    ls -la
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
                    echo "===================================="
                    echo "Installing Dependencies"
                    echo "===================================="

                    npm ci
                '''
            }
        }

        stage('Build') {
            steps {
                sh '''
                    echo "===================================="
                    echo "Building React Application"
                    echo "===================================="

                    npm run build
                '''
            }
        }

        stage('Verify Build') {
            steps {
                sh '''
                    echo "===================================="
                    echo "Verifying Build"
                    echo "===================================="

                    if [ -d "dist" ]; then
                        echo "dist directory found."
                        ls -lh dist
                    elif [ -d "build" ]; then
                        echo "build directory found."
                        ls -lh build
                    else
                        echo "ERROR: Build directory not found!"
                        exit 1
                    fi

                    echo "Build verification successful."
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
            GitHub code successfully built by Jenkins.
            ==========================================
            '''
        }

        failure {
            echo '''
            ==========================================
            BUILD FAILED
            ==========================================
            Check the Jenkins console output.
            ==========================================
            '''
        }

        always {
            echo "Jenkins pipeline completed."
        }
    }
}