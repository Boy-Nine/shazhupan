async function loadAdminActivities() {
    const result = await apiRequest('/activities');
    const container = document.getElementById('adminActivities');

    if (!result.success || !Array.isArray(result.data)) {
        container.innerHTML = '<div class="loading">加载活动失败</div>';
        return;
    }

    if (result.data.length === 0) {
        container.innerHTML = '<div class="loading">暂无活动</div>';
        return;
    }

    container.innerHTML = result.data.map(a => `
        <div class="admin-activity-item">
            <div class="admin-activity-info">
                <span class="admin-activity-title">[ID:${a.id}] ${a.title}</span>
                <span class="admin-activity-time">${a.time || ''}</span>
            </div>
            <div class="admin-activity-actions">
                <button class="admin-open-btn" data-id="${a.id}">查看商详</button>
                <button class="admin-delete-btn" data-id="${a.id}">删除</button>
            </div>
        </div>
    `).join('');

    container.querySelectorAll('.admin-delete-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const id = btn.getAttribute('data-id');
            if (!confirm(`确认删除活动 ${id} 吗？`)) return;
            const res = await apiRequest(`/activities/${id}`, { method: 'DELETE' });
            if (res.success) {
                showToast('删除成功');
                loadAdminActivities();
            } else {
                showToast(res.message || '删除失败');
            }
        });
    });

    container.querySelectorAll('.admin-open-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            window.open(`detail.html?id=${id}`, '_blank');
        });
    });
}

async function createActivity() {
    const title = document.getElementById('titleInput').value.trim();
    const bg_image = document.getElementById('bgInput').value.trim();
    const start_time = document.getElementById('startInput').value.trim();
    const end_time = document.getElementById('endInput').value.trim();
    const detail_top_image = document.getElementById('topImgInput').value.trim();
    const detail_bottom_image = document.getElementById('bottomImgInput').value.trim();

    if (!title) {
        showToast('请输入标题');
        return;
    }

    const body = {
        title,
        bg_image: bg_image || '../bg-1.png',
        start_time,
        end_time,
        detail_top_image: detail_top_image || '../商详图1.jpg',
        detail_bottom_image: detail_bottom_image || '../商详图2.jpeg'
    };

    const res = await apiRequest('/activities', {
        method: 'POST',
        body: JSON.stringify(body)
    });

    if (res.success) {
        showToast('保存成功');
        // 清空表单
        document.getElementById('titleInput').value = '';
        document.getElementById('bgInput').value = '';
        document.getElementById('startInput').value = '';
        document.getElementById('endInput').value = '';
        document.getElementById('topImgInput').value = '';
        document.getElementById('bottomImgInput').value = '';

        loadAdminActivities();
    } else {
        showToast(res.message || '保存失败');
    }
}

function initAdmin() {
    const createBtn = document.getElementById('createBtn');
    createBtn.addEventListener('click', createActivity);

    loadAdminActivities();
}

document.addEventListener('DOMContentLoaded', initAdmin);

