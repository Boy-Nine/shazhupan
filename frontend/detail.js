// 从URL中获取参数
function getQueryParam(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
}

async function loadActivityDetail() {
    const id = getQueryParam('id');
    if (!id) {
        showToast('缺少活动ID');
        return;
    }

    const result = await apiRequest(`/activities/${id}`);
    if (!result.success || !result.data) {
        // 如果是 401 错误，不显示加载活动详情失败的 toast，因为 apiRequest 函数已经显示了登录已过期，请重新登录的 toast，并且已经显示了登录弹窗
        if (result.status !== 401) {
            showToast(result.message || '加载活动详情失败');
        }
        return;
    }

    const activity = result.data;
    const titleEl = document.getElementById('detailTitle');
    const topImgEl = document.getElementById('detailTopImage');
    const bottomImgEl = document.getElementById('detailBottomImage');

    titleEl.textContent = activity.title || '活动详情';

    if (activity.detail_top_image) {
        topImgEl.src = activity.detail_top_image;
    } else {
        topImgEl.src = '../商详图1.jpg';
    }

    if (activity.detail_bottom_image) {
        bottomImgEl.src = activity.detail_bottom_image;
    } else {
        bottomImgEl.src = '../商详图2.jpeg';
    }
}

function initDetailPage() {
    const backBtn = document.getElementById('backBtn');
    const receiveBtn = document.getElementById('receiveBtn');
    const agreementCheck = document.getElementById('detailAgreementCheck');

    backBtn.addEventListener('click', () => {
        // 返回列表页
        window.location.href = 'index.html';
    });

    receiveBtn.addEventListener('click', () => {
        if (!agreementCheck.checked) {
            showToast('请先同意用户协议和隐私政策');
            return;
        }
        showToast('已领取，具体领取逻辑可根据业务补充');
    });

    // 初始化登录弹窗事件
    if (LoginModal && LoginModal.getCodeBtn && LoginModal.loginBtn) {
        LoginModal.getCodeBtn.addEventListener('click', () => {
            LoginModal.sendCode();
        });
        
        LoginModal.loginBtn.addEventListener('click', () => {
            LoginModal.login();
        });
        
        // 回车键登录
        if (LoginModal.codeInput) {
            LoginModal.codeInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    LoginModal.login();
                }
            });
        }
        
        // 点击遮罩关闭弹窗
        if (LoginModal.overlay) {
            LoginModal.overlay.addEventListener('click', (e) => {
                if (e.target === LoginModal.overlay) {
                    LoginModal.hide();
                }
            });
        }
    }

    loadActivityDetail();
}

document.addEventListener('DOMContentLoaded', initDetailPage);

