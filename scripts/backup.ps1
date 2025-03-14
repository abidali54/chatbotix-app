param(
    [string]$backupDir = "C:\backups\chatbotix"
)

# Create backup directory if it doesn't exist
if (-not (Test-Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir
}

# Get timestamp for backup file
$timestamp = Get-Date -Format "yyyy-MM-dd-HHmmss"
$backupFile = Join-Path $backupDir "backup-$timestamp.sql"

# Load environment variables
$env:PGPASSWORD = $env:DB_PASSWORD

# Create backup
Write-Host "Creating database backup..."
pg_dump -h localhost -U $env:DB_USER -d $env:DB_NAME -F c -f $backupFile

# Clean old backups (keep last 7 days)
Get-ChildItem $backupDir -Filter "backup-*.sql" | 
    Where-Object { $_.CreationTime -lt (Get-Date).AddDays(-7) } |
    Remove-Item

Write-Host "Backup completed: $backupFile"