@echo off
REM 前端启动脚本（Windows）

echo 正在启动前端服务...
echo.

REM 检查Python是否安装
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 错误：未找到Python，请先安装Python
    pause
    exit /b 1
)

REM 启动服务
echo ✅ 前端服务启动中...
echo 📍 访问地址: http://localhost:8080
echo.
echo 按 Ctrl+C 停止服务
echo.

python -m http.server 8080

pause
