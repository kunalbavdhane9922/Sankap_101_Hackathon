@echo off
cd /d "D:\D- Drive\Hackthon -- Sankalp 101\Dynamic Github repo for Sankalp Hackathon"

echo Adding files...
git add .

echo Committing changes...
git commit -m "Automated commit"

echo Pushing to GitHub with force...
git push origin main --force

pause
