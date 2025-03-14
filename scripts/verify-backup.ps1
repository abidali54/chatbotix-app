param(
    [string]$backupFile
)

# Verify backup file exists and is not empty
if (-not (Test-Path $backupFile)) {
    Write-Error "Backup file not found: $backupFile"
    exit 1
}

if ((Get-Item $backupFile).Length -eq 0) {
    Write-Error "Backup file is empty: $backupFile"
    exit 1
}

# Test restore to temporary database
$testDb = "verify_backup_test"
Write-Host "Creating test database..."
createdb -U $env:DB_USER $testDb

Write-Host "Attempting test restore..."
pg_restore -U $env:DB_USER -d $testDb $backupFile

if ($LASTEXITCODE -eq 0) {
    Write-Host "Backup verification successful"
} else {
    Write-Error "Backup verification failed"
}

# Cleanup
Write-Host "Cleaning up test database..."
dropdb -U $env:DB_USER $testDb