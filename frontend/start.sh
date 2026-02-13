#!/bin/bash

# 前端启动脚本（Mac/Linux）

echo "正在启动前端服务..."
echo ""

# 检查Python是否安装
if ! command -v python3 &> /dev/null; then
    echo "❌ 错误：未找到Python3，请先安装Python"
    exit 1
fi

# 启动服务
echo "✅ 前端服务启动中..."
echo "📍 访问地址: http://localhost:8080"
echo ""
echo "按 Ctrl+C 停止服务"
echo ""

python3 -m http.server 8080
