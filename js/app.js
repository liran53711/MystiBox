// 全局变量
let currentUser = null;
let currentPage = 'home';

// 页面初始化
document.addEventListener('DOMContentLoaded', function() {
    initApp();
    setupEventListeners();
    checkLoginStatus();
});

// 初始化应用
function initApp() {
    console.log('MystiBox 应用初始化...');
    loadFeaturedBoxes();
}

// 设置事件监听器
function setupEventListeners() {
    // 导航链接点击事件
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('href').substring(1);
            showPage(page);
        });
    });

    // 搜索框事件
    const searchBox = document.getElementById('searchBox');
    if (searchBox) {
        searchBox.addEventListener('input', debounce(searchBoxes, 300));
    }

    // 分类筛选事件
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterBoxes);
    }
}

// 显示页面
function showPage(pageName) {
    // 隐藏所有页面
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });

    // 显示目标页面
    const targetPage = document.getElementById(pageName);
    if (targetPage) {
        targetPage.classList.add('active');
        currentPage = pageName;

        // 更新导航状态
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[href="#${pageName}"]`).classList.add('active');

        // 加载页面数据
        loadPageData(pageName);
    }
}

// 加载页面数据
function loadPageData(pageName) {
    switch(pageName) {
        case 'boxes':
            loadAllBoxes();
            break;
        case 'collection':
            loadUserCollection();
            break;
        case 'friends':
            loadFriendsData();
            break;
        case 'profile':
            loadUserProfile();
            break;
    }
}

// 显示模态框
function showModal(content) {
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = content;
    modal.style.display = 'block';
}

// 关闭模态框
function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

// 防抖函数
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 显示加载状态
function showLoading(containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '<div class="loading"><div class="spinner"></div></div>';
}

// 显示错误信息
function showError(message) {
    alert('错误: ' + message);
}

// 显示成功信息
function showSuccess(message) {
    alert('成功: ' + message);
}

// 格式化价格
function formatPrice(price) {
    return '¥' + parseFloat(price).toFixed(2);
}

// 格式化日期
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN');
}