# 登录系统项目

一个完整的H5登录系统，包含前端页面和后端API服务。

## 📋 项目结构

```
shazhupan/
├── backend/          # 后端服务（Python FastAPI）
│   ├── main.py      # FastAPI服务器主文件
│   ├── requirements.txt # Python依赖包列表
│   └── .env.example # 环境变量示例
└── frontend/         # 前端H5页面
    ├── index.html   # 主页面
    ├── styles.css   # 样式文件
    └── app.js       # 前端逻辑
```

## ✨ 功能特性

### 后端功能
- ✅ 手机号验证码发送（模拟）
- ✅ 手机号+验证码登录/注册
- ✅ JWT Token生成和验证
- ✅ Token验证中间件
- ✅ 活动列表API（需要token）

### 前端功能
- ✅ 活动列表页面展示
- ✅ 登录弹窗（token无效时自动弹出）
- ✅ Token自动管理（localStorage）
- ✅ 自动验证token有效性
- ✅ Toast提示消息

## 🚀 完整部署流程（小白教程）

### 第一步：检查环境

#### 1.1 检查是否已安装Python

打开终端（Mac/Linux）或命令提示符（Windows），输入：

```bash
python --version
```

或者：

```bash
python3 --version
```

**如果显示版本号（如 Python 3.8.0），说明已安装，跳到第二步。**

**如果没有安装Python，请继续：**

#### 1.2 安装Python（如果未安装）

**Mac系统：**
- 访问 https://www.python.org/downloads/
- 下载最新版本的Python（推荐3.8+）
- 双击安装包，按提示安装
- 安装完成后，重新打开终端，输入 `python3 --version` 验证

**Windows系统：**
- 访问 https://www.python.org/downloads/
- 下载最新版本的Python（推荐3.8+）
- 双击安装包，**重要：勾选 "Add Python to PATH"**
- 点击 "Install Now" 完成安装
- 重新打开命令提示符，输入 `python --version` 验证

**Linux系统：**
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install python3 python3-pip

# CentOS/RHEL
sudo yum install python3 python3-pip
```

---

### 第二步：安装后端依赖

#### 2.1 打开终端，进入项目目录

```bash
# 进入项目根目录
cd /Users/admin/Desktop/githubproject/shazhupan

# 进入后端目录
cd backend
```

#### 2.2 安装Python依赖包

```bash
# Mac/Linux系统使用：
pip3 install -r requirements.txt

# Windows系统使用：
pip install -r requirements.txt
```

**如果提示权限错误，可以加上 `--user`：**
```bash
pip3 install --user -r requirements.txt
```

**安装成功的标志：** 看到类似 `Successfully installed fastapi-0.104.1 uvicorn-0.24.0 ...` 的提示

---

### 第三步：启动后端服务

#### 3.1 确保在backend目录下

```bash
# 如果不在backend目录，先进入
cd backend
```

#### 3.2 启动后端服务

**方式一：使用启动脚本（最简单，推荐）**

**Mac/Linux系统：**
```bash
cd backend
./start.sh
```

**Windows系统：**
```bash
cd backend
start.bat
```
（双击 `start.bat` 文件也可以）

**方式二：手动启动**

```bash
# Mac/Linux系统：
python3 main.py

# Windows系统：
python main.py
```

**方式三：使用uvicorn命令**

```bash
# Mac/Linux系统：
uvicorn main:app --host 0.0.0.0 --port 3000

# Windows系统：
uvicorn main:app --host 0.0.0.0 --port 3000
```

#### 3.3 验证后端是否启动成功

看到以下信息说明启动成功：

```
INFO:     Started server process [xxxxx]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:3000 (Press CTRL+C to quit)
```

**保持这个终端窗口打开，不要关闭！**

#### 3.4 测试后端API（可选）

打开浏览器访问：`http://localhost:3000`

如果看到JSON格式的API信息，说明后端运行正常。

---

### 第四步：启动前端页面

#### 4.1 打开新的终端窗口

**重要：** 保持后端服务的终端窗口打开，打开一个新的终端窗口来启动前端。

#### 4.2 进入前端目录

```bash
cd /Users/admin/Desktop/githubproject/shazhupan/frontend
```

#### 4.3 启动前端服务器

**方式一：使用启动脚本（最简单，推荐）**

**Mac/Linux系统：**
```bash
cd frontend
./start.sh
```

**Windows系统：**
```bash
cd frontend
start.bat
```
（双击 `start.bat` 文件也可以）

**方式二：手动启动（使用Python）**

```bash
# Mac/Linux系统：
python3 -m http.server 8080

# Windows系统：
python -m http.server 8080
```

**方式三：使用Node.js（如果已安装Node.js）**

```bash
# 先安装http-server（只需安装一次）
npm install -g http-server

# 启动服务器
http-server -p 8080
```

**方式四：使用VS Code Live Server插件**

1. 在VS Code中安装 "Live Server" 插件
2. 右键点击 `frontend/index.html` 文件
3. 选择 "Open with Live Server"

#### 4.4 访问前端页面

打开浏览器，访问：`http://localhost:8080`

**如果看到活动列表页面或登录弹窗，说明前端启动成功！**

---

### 第五步：测试登录功能

#### 5.1 打开浏览器开发者工具

- **Chrome/Edge：** 按 `F12` 或 `Ctrl+Shift+I`（Windows） / `Cmd+Option+I`（Mac）
- **Firefox：** 按 `F12` 或 `Ctrl+Shift+I`（Windows） / `Cmd+Option+I`（Mac）
- **Safari：** 按 `Cmd+Option+I`（需要先在偏好设置中启用开发者菜单）

#### 5.2 切换到Console（控制台）标签

在开发者工具中找到 "Console" 标签页

#### 5.3 测试登录流程

1. **输入手机号**
   - 在登录弹窗中输入手机号（格式：1开头的11位数字，如：13800138000）

2. **获取验证码**
   - 点击"获取验证码"按钮
   - 查看后端服务的终端窗口，会看到类似这样的输出：
     ```
     [验证码] 手机号: 13800138000, 验证码: 123456, 有效期: 5分钟
     ```
   - 或者查看浏览器控制台，也会显示验证码

3. **输入验证码**
   - 将看到的验证码输入到"验证码"输入框

4. **同意协议**
   - 勾选"登录即同意《用户注册协议》和《隐私政策》"复选框

5. **确认登录**
   - 点击"确认登录"按钮
   - 如果成功，会看到"登录成功"的提示，登录弹窗会自动关闭
   - 页面会显示活动列表

6. **验证Token**
   - 刷新页面，如果token有效，会直接显示活动列表
   - 如果token无效，会再次弹出登录弹窗

---

## 📚 常见问题解决

### 问题1：`python: command not found` 或 `python3: command not found`

**解决方法：**
- Mac/Linux：确保Python已正确安装，尝试使用 `python3` 而不是 `python`
- Windows：重新安装Python，确保勾选了 "Add Python to PATH"

### 问题2：`pip: command not found` 或 `pip3: command not found`

**解决方法：**
```bash
# Mac/Linux
python3 -m pip install -r requirements.txt

# Windows
python -m pip install -r requirements.txt
```

### 问题3：端口被占用（`Address already in use`）

**解决方法：**
- 后端端口3000被占用：修改 `backend/main.py` 最后一行，将 `port=3000` 改为其他端口（如3001），同时修改 `frontend/app.js` 中的 `API_BASE_URL`
- 前端端口8080被占用：使用其他端口，如 `python3 -m http.server 8081`

### 问题4：前端页面无法访问后端API（CORS错误）

**解决方法：**
- 确保后端服务已启动
- 检查 `frontend/app.js` 中的 `API_BASE_URL` 是否正确
- 确保后端 `main.py` 中的CORS配置允许前端域名

### 问题5：验证码收不到

**解决方法：**
- 这是正常的！当前是开发环境，验证码不会真正发送短信
- 查看后端服务的终端窗口，会打印验证码
- 或者查看浏览器控制台，也会显示验证码

### 问题6：登录后还是弹出登录弹窗

**解决方法：**
- 检查浏览器控制台是否有错误信息
- 确认后端服务正在运行
- 清除浏览器缓存和localStorage：按F12打开控制台，输入 `localStorage.clear()` 后回车

---

## 🔧 开发说明

### Token管理

- Token存储在浏览器的 `localStorage` 中
- Token有效期为7天
- 每次API请求会自动携带token
- 如果token无效（401），会自动清除token并弹出登录弹窗

### 验证码机制

- 验证码为6位数字
- 验证码有效期为5分钟
- 开发环境会在后端终端和控制台打印验证码，方便测试
- 生产环境需要接入真实的短信服务

### 修改配置

**修改后端端口：**
编辑 `backend/main.py` 文件，找到最后一行：
```python
uvicorn.run(app, host="0.0.0.0", port=3000)  # 修改这里的3000
```

**修改前端API地址：**
编辑 `frontend/app.js` 文件，找到第一行：
```javascript
const API_BASE_URL = 'http://localhost:3000/api';  // 修改这里的地址
```

---

## 📡 API接口文档

### 1. 发送验证码

**POST** `http://localhost:3000/api/send-code`

请求体：
```json
{
  "phone": "13800138000"
}
```

响应：
```json
{
  "success": true,
  "message": "验证码已发送",
  "data": {
    "code": "123456"
  }
}
```

### 2. 登录/注册

**POST** `http://localhost:3000/api/login`

请求体：
```json
{
  "phone": "13800138000",
  "code": "123456"
}
```

响应：
```json
{
  "success": true,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "phone": "13800138000"
    }
  }
}
```

### 3. 验证Token

**GET** `http://localhost:3000/api/verify-token`

请求头：
```
Authorization: Bearer <token>
```

响应：
```json
{
  "success": true,
  "message": "token有效",
  "data": {
    "user": {
      "phone": "13800138000"
    }
  }
}
```

### 4. 获取活动列表

**GET** `http://localhost:3000/api/activities`

请求头：
```
Authorization: Bearer <token>
```

响应：
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "风行视频新春会员活动",
      "time": "2025/12/17 - 2026/03/31",
      "banner": "...",
      "tag": "首3天试用视频会员"
    }
  ]
}
```

---

## 🛡️ 安全建议（生产环境）

1. **修改JWT密钥**
   - 修改 `backend/main.py` 中的 `JWT_SECRET` 为强随机字符串

2. **删除验证码返回**
   - 生产环境应删除API响应中的验证码字段

3. **接入真实短信服务**
   - 替换模拟的验证码发送逻辑

4. **使用HTTPS**
   - 生产环境必须使用HTTPS协议

5. **配置CORS**
   - 修改 `backend/main.py` 中的 `allow_origins`，指定具体的前端域名

6. **使用数据库**
   - 将内存存储改为数据库存储（如MySQL、PostgreSQL、MongoDB等）

---

## 🛠️ 技术栈

- **后端**：Python 3.8+ + FastAPI + JWT
- **前端**：原生HTML/CSS/JavaScript
- **存储**：localStorage（前端）、内存（后端，生产环境应使用数据库）

---

## 📝 许可证

ISC

---

## 💡 提示

- 开发时保持两个终端窗口打开：一个运行后端，一个运行前端
- 修改代码后，后端需要重启（按Ctrl+C停止，然后重新运行）
- 前端修改后刷新浏览器即可看到效果
- 遇到问题先查看终端和浏览器控制台的错误信息
