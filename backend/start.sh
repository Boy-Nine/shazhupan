#!/bin/bash

# 后端启动脚本（Mac/Linux）

echo "正在启动后端服务..."
echo ""

# 检查Python是否安装
if ! command -v python3 &> /dev/null; then
    echo "❌ 错误：未找到Python3，请先安装Python"
    exit 1
fi

# 检查依赖是否安装
if ! python3 -c "import fastapi" &> /dev/null; then
    echo "⚠️  检测到依赖未安装，正在安装..."
    pip3 install -r requirements.txt
    echo ""
fi

# 启动服务
echo "✅ 后端服务启动中..."
echo "📍 访问地址: http://localhost:3000"
echo "📍 API文档: http://localhost:3000/docs"
echo ""
echo "按 Ctrl+C 停止服务"
echo ""

python3 main.py
