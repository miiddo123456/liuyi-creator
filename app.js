/* ===== 通用工具函数 ===== */

/** 显示 Toast 提示 */
function showToast(message, type = 'info', duration = 3000) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; toast.style.transition = 'opacity .3s'; setTimeout(() => toast.remove(), 300); }, duration);
}

/** 显示弹窗 */
function showModal(modalId) {
  const el = document.getElementById(modalId);
  if (el) el.classList.add('show');
}
function hideModal(modalId) {
  const el = document.getElementById(modalId);
  if (el) el.classList.remove('show');
}

/** 显示抽屉 */
function showDrawer(drawerId) {
  document.getElementById(drawerId + '-overlay')?.classList.add('show');
  document.getElementById(drawerId)?.classList.add('open');
}
function hideDrawer(drawerId) {
  document.getElementById(drawerId + '-overlay')?.classList.remove('show');
  document.getElementById(drawerId)?.classList.remove('open');
}

/** 复制文本到剪贴板 */
function copyText(text, successMsg = '已复制到剪贴板') {
  navigator.clipboard.writeText(text).then(() => {
    showToast(successMsg, 'success');
  }).catch(() => {
    // fallback
    const ta = document.createElement('textarea');
    ta.value = text; document.body.appendChild(ta);
    ta.select(); document.execCommand('copy'); document.body.removeChild(ta);
    showToast(successMsg, 'success');
  });
}

/** 金额格式化 */
function formatMoney(val) {
  return '¥' + Number(val).toFixed(2);
}

/** 手机号脱敏 */
function maskPhone(phone) {
  if (!phone) return '';
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
}

/** 身份证脱敏 */
function maskIdCard(id) {
  if (!id) return '';
  return id.replace(/^(.{4}).{10}(.{4})$/, '$1**********$2');
}

/** 获取当前页面名称（用于侧边栏高亮） */
function getPageKey() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  return path;
}

/** 格式化日期 */
function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const pad = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** 分页组件渲染 */
function renderPagination(containerId, current, total, pageSize = 10, callback) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const totalPages = Math.ceil(total / pageSize);
  let html = '<span class="page-info">共 ' + total + ' 条</span>';
  html += '<button class="page-btn" onclick="' + callback + '(' + (current-1) + ')" ' + (current <= 1 ? 'disabled' : '') + '>‹</button>';
  for (let i = Math.max(1, current-2); i <= Math.min(totalPages, current+2); i++) {
    html += '<button class="page-btn' + (i === current ? ' active' : '') + '" onclick="' + callback + '(' + i + ')">' + i + '</button>';
  }
  html += '<button class="page-btn" onclick="' + callback + '(' + (current+1) + ')" ' + (current >= totalPages ? 'disabled' : '') + '>›</button>';
  html += '<span class="page-info">第 ' + current + '/' + totalPages + ' 页</span>';
  container.innerHTML = html;
}

/** 用户下拉菜单：切换显示/隐藏 */
function toggleUserMenu(event) {
  event.stopPropagation();
  const existing = document.getElementById('userMenu');
  if (existing) { existing.remove(); document.removeEventListener('click', closeUserMenu); return; }

  const menu = document.createElement('div');
  menu.id = 'userMenu';
  menu.style.cssText = 'position:fixed;z-index:2000;background:#fff;border:1px solid #ebebeb;border-radius:10px;box-shadow:0 8px 30px rgba(0,0,0,.1);min-width:160px;padding:6px;';
  menu.innerHTML = `
    <div onclick="showLogoutConfirm()" style="padding:10px 14px;cursor:pointer;border-radius:6px;font-size:13px;color:#c0392b;display:flex;align-items:center;gap:8px;transition:background .15s;white-space:nowrap;" onmouseover="this.style.background='#fdedec'" onmouseout="this.style.background=''">
      🚪 退出登录
    </div>
  `;

  // 定位菜单到点击位置下方
  const rect = event.target.closest('.user-info').getBoundingClientRect();
  menu.style.top = (rect.bottom + 6) + 'px';
  menu.style.right = '24px';

  document.body.appendChild(menu);
  setTimeout(() => document.addEventListener('click', closeUserMenu), 0);
}

function closeUserMenu() {
  const menu = document.getElementById('userMenu');
  if (menu) menu.remove();
  document.removeEventListener('click', closeUserMenu);
}

/** 显示退出确认弹窗 */
function showLogoutConfirm() {
  closeUserMenu();
  // 创建遮罩
  const overlay = document.createElement('div');
  overlay.id = 'logoutOverlay';
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:3000;display:flex;align-items:center;justify-content:center;';
  overlay.innerHTML = `
    <div style="background:#fff;border-radius:16px;width:360px;max-width:90vw;padding:32px 24px;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,.15);">
      <div style="font-size:48px;margin-bottom:12px;">🚪</div>
      <div style="font-size:18px;font-weight:700;color:#222;margin-bottom:6px;">确认退出</div>
      <div style="font-size:14px;color:#888;margin-bottom:24px;">确定要退出当前账号吗？</div>
      <div style="display:flex;gap:12px;justify-content:center;">
        <button onclick="document.getElementById('logoutOverlay').remove()" style="flex:1;padding:11px 0;border:1px solid #e0e0e0;border-radius:8px;background:#fff;cursor:pointer;font-size:14px;color:#666;font-weight:500;">取消</button>
        <button onclick="window.location.href='login.html'" style="flex:1;padding:11px 0;border:none;border-radius:8px;background:#e67e22;cursor:pointer;font-size:14px;color:#fff;font-weight:500;">确认退出</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
}

/** 退出登录 */
function logout() {
  window.location.href = 'login.html';
}

/** 侧边栏：切换菜单展开/收起 */
function toggleMenu(el) {
  const sub = el.nextElementSibling;
  const arrow = el.querySelector('.arrow');
  if (sub && sub.classList.contains('sub-menu')) {
    sub.classList.toggle('open');
    if (arrow) arrow.classList.toggle('open');
  }
}

/** 侧边栏：初始化高亮与自动展开 */
document.addEventListener('DOMContentLoaded', function() {
  const pageKey = getPageKey();

  // 高亮当前子菜单项，并展开其父级
  document.querySelectorAll('.sub-item').forEach(item => {
    const href = item.getAttribute('href');
    if (href === pageKey) {
      item.classList.add('active');
      // 展开父级 sub-menu
      const parentSub = item.closest('.sub-menu');
      if (parentSub) {
        parentSub.classList.add('open');
        // 同时展开箭头
        const prev = parentSub.previousElementSibling;
        if (prev && prev.classList.contains('menu-category')) {
          const arrow = prev.querySelector('.arrow');
          if (arrow) arrow.classList.add('open');
        }
      }
    }
  });

  // 高亮当前单页面菜单
  document.querySelectorAll('.menu-single').forEach(item => {
    const href = item.getAttribute('href');
    if (href === pageKey) {
      item.classList.add('active');
    }
  });
});
