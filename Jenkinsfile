pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git branch: 'mian',  // BUG: typo 'mian' instead of 'main'
                    url: 'https://github.com/your-org/sample-project.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                // BUG: missing 'sh' keyword
                'npm install'
            }
        }

        stage('Run Tests') {
            steps {
                sh 'npm test'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t sample-project .'
                // BUG: missing docker push step
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                    docker stop sample-project || true
                    docker rm sample-project || true
                    // BUG: wrong port mapping (app is on 3000, not 8080)
                    docker run -d --name sample-project -p 80:8080 sample-project
                '''
            }
        }
    }

    post {
        always {
            // BUG: invalid cleanup step syntax
            cleanupWorkspace()
        }
        failure {
            mail to: 'team@example.com'
                subject: "Build Failed: ${env.JOB_NAME}"  // BUG: missing comma
                body: "Check Jenkins for details."
        }
    }
}
