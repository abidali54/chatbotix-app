param(
    [string]$containerName = "chatbotix-test"
)

# Build and run test container
Write-Host "Building test container..."
docker build -t $containerName-image .

Write-Host "Running test container..."
docker run -d --name $containerName $containerName-image

# Wait for container to start
Start-Sleep -Seconds 10

# Run health check
$healthCheck = docker exec $containerName curl -s http://localhost:3001/health
if ($healthCheck) {
    Write-Host "Container health check passed"
} else {
    Write-Host "Container health check failed"
    exit 1
}

# Cleanup
docker stop $containerName
docker rm $containerName