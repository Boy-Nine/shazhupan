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
        showToast(result.message || '加载活动详情失败');
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

    loadActivityDetail();
}

document.addEventListener('DOMContentLoaded', initDetailPage);

