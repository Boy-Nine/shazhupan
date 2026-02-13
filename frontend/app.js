// API配置
const API_BASE_URL = 'http://localhost:3000/api';

// Token管理
const TokenManager = {
    getToken() {
        return localStorage.getItem('token');
    },
    
    setToken(token) {
        localStorage.setItem('token', token);
    },
    
    removeToken() {
        localStorage.removeItem('token');
    },
    
    hasToken() {
        return !!this.getToken();
    }
};

// Toast提示
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2000);
}

// API请求封装
async function apiRequest(url, options = {}) {
    const token = TokenManager.getToken();
    
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}${url}`, {
            ...options,
            headers
        });

        const raw = await response.json();

        // 统一响应结构：始终返回 { success, status, data, message }
        let result = {
            success: response.ok,
            status: response.status,
            data: raw,
            message: undefined
        };

        // FastAPI 统一响应：{ success, message, data }
        if (raw && typeof raw === 'object' && 'success' in raw) {
            result.success = response.ok && !!raw.success;
            result.message = raw.message;
            result.data = raw.data !== undefined ? raw.data : raw;
        } else if (raw && typeof raw === 'object' && 'detail' in raw) {
            // FastAPI 错误：{ detail: 'xxx' }
            result.message = raw.detail;
        }

        // 如果token无效，清除token并显示登录弹窗
        if (response.status === 401) {
            TokenManager.removeToken();
            showLoginModal();
            showToast('登录已过期，请重新登录');
        }

        return result;
    } catch (error) {
        console.error('API请求失败:', error);
        return { success: false, status: 0, data: null, message: error.message };
    }
}

// 登录弹窗控制
const LoginModal = {
    overlay: document.getElementById('loginOverlay'),
    phoneInput: document.getElementById('phoneInput'),
    codeInput: document.getElementById('codeInput'),
    getCodeBtn: document.getElementById('getCodeBtn'),
    loginBtn: document.getElementById('loginBtn'),
    agreementCheck: document.getElementById('agreementCheck'),
    countdown: 0,
    countdownTimer: null,
    
    show() {
        this.overlay.classList.add('show');
        document.body.style.overflow = 'hidden';
    },
    
    hide() {
        this.overlay.classList.remove('show');
        document.body.style.overflow = '';
        this.resetForm();
    },
    
    resetForm() {
        this.phoneInput.value = '';
        this.codeInput.value = '';
        this.agreementCheck.checked = false;
        this.resetCountdown();
    },
    
    startCountdown() {
        this.countdown = 60;
        this.getCodeBtn.disabled = true;
        
        this.countdownTimer = setInterval(() => {
            this.countdown--;
            this.getCodeBtn.textContent = `${this.countdown}秒后重试`;
            
            if (this.countdown <= 0) {
                this.resetCountdown();
            }
        }, 1000);
    },
    
    resetCountdown() {
        if (this.countdownTimer) {
            clearInterval(this.countdownTimer);
            this.countdownTimer = null;
        }
        this.countdown = 0;
        this.getCodeBtn.disabled = false;
        this.getCodeBtn.textContent = '获取验证码';
    },
    
    validatePhone() {
        const phone = this.phoneInput.value.trim();
        if (!phone) {
            showToast('请输入手机号');
            return false;
        }
        if (!/^1[3-9]\d{9}$/.test(phone)) {
            showToast('请输入正确的手机号');
            return false;
        }
        return true;
    },
    
    async sendCode() {
        if (!this.validatePhone()) {
            return;
        }
        
        const phone = this.phoneInput.value.trim();
        const result = await apiRequest('/send-code', {
            method: 'POST',
            body: JSON.stringify({ phone })
        });
        
        if (result.success) {
            showToast('验证码已发送');
            this.startCountdown();
            // 开发环境显示验证码
            if (result.data.code) {
                console.log('验证码:', result.data.code);
            }
        } else {
            showToast(result.message || '发送验证码失败');
        }
    },
    
    async login() {
        const phone = this.phoneInput.value.trim();
        const code = this.codeInput.value.trim();
        
        if (!this.validatePhone()) {
            return;
        }
        
        if (!code) {
            showToast('请输入验证码');
            return;
        }
        
        if (!this.agreementCheck.checked) {
            showToast('请先同意用户协议和隐私政策');
            return;
        }
        
        this.loginBtn.disabled = true;
        this.loginBtn.textContent = '登录中...';
        
        const result = await apiRequest('/login', {
            method: 'POST',
            body: JSON.stringify({ phone, code })
        });
        
        this.loginBtn.disabled = false;
        this.loginBtn.textContent = '确认登录';
        
        if (result.success && result.data && result.data.token) {
            // 保存 token 到浏览器
            TokenManager.setToken(result.data.token);
            // 隐藏登录弹窗
            showToast('登录成功');
            this.hide();
            loadActivities();
        } else {
            showToast(result.message || '登录失败');
        }
    }
};

// 显示登录弹窗
function showLoginModal() {
    LoginModal.show();
}

// 加载活动列表
async function loadActivities() {
    const container = document.getElementById('activitiesContainer');
    container.innerHTML = '<div class="loading">加载中...</div>';
    
    const result = await apiRequest('/activities');
    
    if (result.success && result.data) {
        renderActivities(result.data);
    } else {
        container.innerHTML = '<div class="loading">加载失败，请重试</div>';
    }
}

// 渲染活动列表
function renderActivities(activities) {
    const container = document.getElementById('activitiesContainer');
    
    if (!activities || activities.length === 0) {
        container.innerHTML = '<div class="loading">暂无活动</div>';
        return;
    }
    
    container.innerHTML = activities.map(activity => `
        <div class="activity-card" data-id="${activity.id}">
            <div class="activity-banner" style="${activity.bg_image ? `background-image: url('${activity.bg_image}')` : ''}">
                <div class="banner-content">
                    <div class="banner-title">视频会员 新年会员活动</div>
                    <div class="banner-tag">${activity.tag || '首3天试用视频会员'}</div>
                </div>
                <div class="banner-decoration"></div>
            </div>
            <div class="activity-info">
                <div class="activity-name">${activity.title}</div>
                <div class="activity-time">活动时间: ${activity.time}</div>
            </div>
        </div>
    `).join('');

    // 绑定点击事件，进入详情页
    container.querySelectorAll('.activity-card').forEach(card => {
        card.addEventListener('click', () => {
            const id = card.getAttribute('data-id');
            if (id) {
                window.location.href = `detail.html?id=${id}`;
            }
        });
    });
}

// 验证token有效性
async function verifyToken() {
    if (!TokenManager.hasToken()) {
        showLoginModal();
        return false;
    }
    
    const result = await apiRequest('/verify-token');
    
    if (!result.success) {
        return false;
    }
    
    return true;
}

// 初始化
async function init() {
    // 绑定登录弹窗事件
    LoginModal.getCodeBtn.addEventListener('click', () => {
        LoginModal.sendCode();
    });
    
    LoginModal.loginBtn.addEventListener('click', () => {
        LoginModal.login();
    });
    
    // 回车键登录
    LoginModal.codeInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            LoginModal.login();
        }
    });
    
    // 点击遮罩关闭弹窗
    LoginModal.overlay.addEventListener('click', (e) => {
        if (e.target === LoginModal.overlay) {
            LoginModal.hide();
        }
    });
    
    // 验证token并加载活动列表
    const isValid = await verifyToken();
    if (isValid) {
        loadActivities();
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init);
