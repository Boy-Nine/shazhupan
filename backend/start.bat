@echo off
REM 后端启动脚本（Windows）

echo 正在启动后端服务...
echo.

REM 检查Python是否安装
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 错误：未找到Python，请先安装Python
    pause
    exit /b 1
)

REM 检查依赖是否安装
python -c "import fastapi" >nul 2>&1
if errorlevel 1 (
    echo ⚠️  检测到依赖未安装，正在安装...
    pip install -r requirements.txt
    echo.
)

REM 启动服务
echo ✅ 后端服务启动中...
echo 📍 访问地址: http://localhost:3000
echo 📍 API文档: http://localhost:3000/docs
echo.
echo 按 Ctrl+C 停止服务
echo.

python main.py

pause
