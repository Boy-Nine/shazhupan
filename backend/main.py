from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, Any, List
from pathlib import Path
import json
import jwt
from datetime import datetime, timedelta
import secrets
import re

app = FastAPI(title="登录系统API", version="1.0.0")

# CORS配置
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 生产环境应指定具体域名
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 配置
JWT_SECRET = "shazhupan-secret-key-2025-change-in-production"
JWT_ALGORITHM = "HS256"
TOKEN_EXPIRE_DAYS = 7
CODE_EXPIRE_MINUTES = 5

# 内存存储（生产环境应使用数据库）
users = {}  # 手机号 -> 用户信息
verification_codes = {}  # 手机号 -> {code, expires_at}

# 活动数据存储文件
BASE_DIR = Path(__file__).parent
ACTIVITY_FILE = BASE_DIR / "activities.json"


# 请求模型
class SendCodeRequest(BaseModel):
    phone: str = Field(..., description="手机号")


class LoginRequest(BaseModel):
    phone: str = Field(..., description="手机号")
    code: str = Field(..., description="验证码")


# 响应模型
class ResponseModel(BaseModel):
    success: bool
    message: str = ""
    data: Optional[Any] = None


class ActivityBase(BaseModel):
    title: str = Field(..., description="活动标题")
    bg_image: Optional[str] = Field(None, description="背景图地址（URL或相对路径）")
    start_time: Optional[str] = Field(None, description="活动开始时间")
    end_time: Optional[str] = Field(None, description="活动结束时间")
    detail_top_image: Optional[str] = Field(None, description="商详页上半部分图片")
    detail_bottom_image: Optional[str] = Field(None, description="商详页下半部分图片")


class ActivityCreate(ActivityBase):
    pass


class Activity(ActivityBase):
    id: int


# 工具函数
def generate_verification_code() -> str:
    """生成6位数字验证码"""
    return f"{secrets.randbelow(900000) + 100000}"


def validate_phone(phone: str) -> bool:
    """验证手机号格式"""
    pattern = r"^1[3-9]\d{9}$"
    return bool(re.match(pattern, phone))


def generate_token(phone: str) -> str:
    """生成JWT token"""
    expire = datetime.utcnow() + timedelta(days=TOKEN_EXPIRE_DAYS)
    payload = {
        "phone": phone,
        "userId": phone,
        "exp": expire
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def verify_token(token: str) -> dict:
    """验证JWT token"""
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="token已过期，请重新登录")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="token无效，请重新登录")


# Token验证依赖
async def get_current_user(authorization: Optional[str] = Header(None)):
    """从请求头获取并验证token"""
    if not authorization:
        raise HTTPException(status_code=401, detail="未提供token，请先登录")
    
    # 支持 Bearer token 格式
    if authorization.startswith("Bearer "):
        token = authorization.replace("Bearer ", "")
    else:
        token = authorization
    
    payload = verify_token(token)
    return payload


# 活动数据读写工具
def load_activities() -> List[dict]:
    """从JSON文件加载活动列表"""
    if not ACTIVITY_FILE.exists():
        # 初始化一个示例活动
        sample_activities = [
            {
                "id": 1,
                "title": "风行视频新春会员活动",
                "bg_image": "../bg-1.png",
                "start_time": "2025/12/17",
                "end_time": "2026/03/31",
                "detail_top_image": "../商详图1.jpg",
                "detail_bottom_image": "../商详图2.jpeg",
            }
        ]
        ACTIVITY_FILE.write_text(json.dumps(sample_activities, ensure_ascii=False, indent=2), encoding="utf-8")
        return sample_activities

    try:
        data = json.loads(ACTIVITY_FILE.read_text(encoding="utf-8"))
        if isinstance(data, list):
            return data
        return []
    except Exception:
        return []


def save_activities(activities: List[dict]) -> None:
    """保存活动列表到JSON文件"""
    ACTIVITY_FILE.write_text(json.dumps(activities, ensure_ascii=False, indent=2), encoding="utf-8")


def get_next_activity_id(activities: List[dict]) -> int:
    if not activities:
        return 1
    return max(a.get("id", 0) for a in activities) + 1


# API路由
@app.post("/api/send-code", response_model=ResponseModel)
async def send_code(request: SendCodeRequest):
    """发送验证码"""
    phone = request.phone
    
    if not validate_phone(phone):
        raise HTTPException(status_code=400, detail="请输入正确的手机号")
    
    # 生成验证码
    code = generate_verification_code()
    expires_at = datetime.now() + timedelta(minutes=CODE_EXPIRE_MINUTES)
    
    verification_codes[phone] = {
        "code": code,
        "expires_at": expires_at
    }
    
    # 模拟发送验证码（实际应调用短信服务）
    print(f"[验证码] 手机号: {phone}, 验证码: {code}, 有效期: {CODE_EXPIRE_MINUTES}分钟")
    
    return {
        "success": True,
        "message": "验证码已发送",
        "data": {
            # 开发环境返回验证码，生产环境应删除
            "code": code
        }
    }


@app.post("/api/login", response_model=ResponseModel)
async def login(request: LoginRequest):
    """登录/注册"""
    phone = request.phone
    code = request.code
    
    if not validate_phone(phone):
        raise HTTPException(status_code=400, detail="请输入正确的手机号")
    
    if not code or not code.isdigit() or len(code) != 6:
        raise HTTPException(status_code=400, detail="请输入6位验证码")
    
    # 验证验证码
    stored_code_info = verification_codes.get(phone)
    if not stored_code_info:
        raise HTTPException(status_code=400, detail="验证码不存在或已过期，请重新获取")
    
    if stored_code_info["expires_at"] < datetime.now():
        del verification_codes[phone]
        raise HTTPException(status_code=400, detail="验证码已过期，请重新获取")
    
    if stored_code_info["code"] != code:
        raise HTTPException(status_code=400, detail="验证码错误")
    
    # 验证码正确，删除已使用的验证码
    del verification_codes[phone]
    
    # 创建或更新用户
    if phone not in users:
        users[phone] = {
            "phone": phone,
            "created_at": datetime.now().isoformat()
        }
    
    # 生成JWT token
    token = generate_token(phone)
    
    return {
        "success": True,
        "message": "登录成功",
        "data": {
            "token": token,
            "user": {
                "phone": phone
            }
        }
    }


@app.get("/api/verify-token", response_model=ResponseModel)
async def verify_token_endpoint(current_user: dict = Depends(get_current_user)):
    """验证token有效性"""
    return {
        "success": True,
        "message": "token有效",
        "data": {
            "user": {
                "phone": current_user["phone"]
            }
        }
    }


@app.get("/api/activities", response_model=ResponseModel)
async def get_activities(current_user: dict = Depends(get_current_user)):
    """获取活动列表（需要token）"""
    activities = load_activities()

    # 拼接时间显示字段，兼容旧前端
    for item in activities:
        if item.get("start_time") and item.get("end_time"):
            item["time"] = f'{item["start_time"]} - {item["end_time"]}'

    return {
        "success": True,
        "message": "获取活动列表成功",
        "data": activities
    }


@app.get("/api/activities/{activity_id}", response_model=ResponseModel)
async def get_activity_detail(activity_id: int, current_user: dict = Depends(get_current_user)):
    """获取单个活动详情"""
    activities = load_activities()
    for item in activities:
        if item.get("id") == activity_id:
            return {
                "success": True,
                "message": "获取活动详情成功",
                "data": item
            }

    raise HTTPException(status_code=404, detail="活动不存在")


@app.post("/api/activities", response_model=ResponseModel)
async def create_activity(activity: ActivityCreate, current_user: dict = Depends(get_current_user)):
    """创建活动（后台管理）"""
    activities = load_activities()
    new_id = get_next_activity_id(activities)
    new_activity = {"id": new_id, **activity.model_dict()}
    activities.append(new_activity)
    save_activities(activities)

    return {
        "success": True,
        "message": "创建活动成功",
        "data": new_activity
    }


@app.delete("/api/activities/{activity_id}", response_model=ResponseModel)
async def delete_activity(activity_id: int, current_user: dict = Depends(get_current_user)):
    """删除活动（后台管理）"""
    activities = load_activities()
    filtered = [a for a in activities if a.get("id") != activity_id]

    if len(filtered) == len(activities):
        raise HTTPException(status_code=404, detail="活动不存在")

    save_activities(filtered)
    return {
        "success": True,
        "message": "删除活动成功",
        "data": {"id": activity_id}
    }


@app.get("/")
async def root():
    """根路径，返回API信息"""
    return {
        "message": "登录系统API",
        "version": "1.0.0",
        "endpoints": {
            "POST /api/send-code": "发送验证码",
            "POST /api/login": "登录/注册",
            "GET /api/verify-token": "验证token",
            "GET /api/activities": "获取活动列表（需要token）"
        }
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=3000)
