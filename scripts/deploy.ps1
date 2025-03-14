# Deployment script for Windows
param(
    [string]$environment = "production"
)

# Load environment variables
$envFile = ".env.$environment"
if (Test-Path $envFile) {
    Get-Content $envFile | ForEach-Object {
        if ($_ -match '^([^=]+)=(.*)$') {
            $env:$($matches[1]) = $matches[2]
        }
    }
}

# Build steps
Write-Host "Building application..."
npm run build

# Database migration
Write-Host "Running database migrations..."
npx prisma migrate deploy

# Start application
Write-Host "Starting application..."
if ($environment -eq "production") {
    pm2 start npm --name "chatbotix" -- start
} else {
    npm run dev
}