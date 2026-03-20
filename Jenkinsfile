pipeline {
    agent any

    environment {
        GITHUB_REPO = 'https://github.com/Surendra218/sample-project.git'
        DOCKER_IMAGE = 'sample-project'
        DOCKER_TAG = "${env.BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: "${env.GITHUB_REPO}"
                // Copy analyzer to persistent location so cleanWs doesn't delete it
                sh 'cp scripts/analyze-build-error.js /var/jenkins_home/analyze-build-error.js'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Run Tests') {
            steps {
                sh 'npm test'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh "docker build -t ${env.DOCKER_IMAGE}:${env.DOCKER_TAG} ."
                sh "docker tag ${env.DOCKER_IMAGE}:${env.DOCKER_TAG} ${env.DOCKER_IMAGE}:latest"
            }
        }

        stage('Deploy') {
            steps {
                sh "docker stop ${env.DOCKER_IMAGE} || true"
                sh "docker rm ${env.DOCKER_IMAGE} || true"
                sh "docker run -d --name ${env.DOCKER_IMAGE} -p 3000:3000 ${env.DOCKER_IMAGE}:latest"
                echo "App deployed at http://localhost:3000"
            }
        }
    }

    post {
        always {
            cleanWs()
        }
        success {
            echo "✅ Build #${env.BUILD_NUMBER} succeeded!"
        }
        failure {
            sh """
                echo ""
                echo "════════════════════════════════════════════════════════"
                echo "🤖  AI BUILD ERROR ANALYZER - Running..."
                echo "════════════════════════════════════════════════════════"
                BUILD_NUMBER=${env.BUILD_NUMBER} \
                JOB_NAME=sample-pipeline \
                CLAUDE_API_KEY=${env.CLAUDE_API_KEY} \
                node /var/jenkins_home/analyze-build-error.js 2>&1 || \
                echo "⚠️  AI analysis failed"
            """
        }
    }
}
