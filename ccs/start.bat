@echo off
start cmd /k "php artisan serve"

cd ccs-frontend
start cmd /k "npm run dev"