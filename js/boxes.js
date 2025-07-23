// 盲盒相关功能
let allBoxes = [];

// 创建3D盲盒
function create3DBox(rarity = 'common') {
    return `
        <div class="box-3d ${rarity}">
            <div class="box-face box-front"></div>
            <div class="box-face box-back"></div>
            <div class="box-face box-right"></div>
            <div class="box-face box-left"></div>
            <div class="box-face box-top"></div>
            <div class="box-face box-bottom"></div>
        </div>
    `;
}

// 创建盲盒卡片
function createBoxCard(box) {
    return `
        <div class="box-card" onclick="showBoxDetails(${box.id})">
            <div class="box-image">
                ${create3DBox(box.rarity)}
            </div>
            <div class="box-info">
                <div class="box-name">${box.name}</div>
                <div class="box-description">${box.description}</div>
                <div class="box-rarity ${box.rarity}">${getRarityText(box.rarity)}</div>
                <div class="box-details">
                    <div class="box-price">¥${box.price}</div>
                    <div class="box-stock">库存: ${box.stock}</div>
                </div>
                <button class="box-buy-btn" onclick="event.stopPropagation(); buyBox(${box.id})" 
                        ${box.stock <= 0 ? 'disabled' : ''}>
                    ${box.stock <= 0 ? '售罄' : '购买盲盒'}
                </button>
            </div>
        </div>
    `;
}

// 获取稀有度文本
function getRarityText(rarity) {
    const rarityMap = {
        'common': '普通',
        'rare': '稀有',
        'epic': '史诗',
        'legendary': '传奇'
    };
    return rarityMap[rarity] || '普通';
}

// 加载热门盲盒
async function loadFeaturedBoxes() {
    showLoading('featuredBoxes');
    try {
        const boxes = await mockAPI.getFeaturedBoxes();
        const container = document.getElementById('featuredBoxes');
        container.innerHTML = boxes.map(box => createBoxCard(box)).join('');
    } catch (error) {
        showError('加载热门盲盒失败');
    }
}

// 加载所有盲盒
async function loadAllBoxes() {
    showLoading('allBoxes');
    try {
        allBoxes = await mockAPI.getAllBoxes();
        displayBoxes(allBoxes);
    } catch (error) {
        showError('加载盲盒列表失败');
    }
}

// 显示盲盒列表
function displayBoxes(boxes) {
    const container = document.getElementById('allBoxes');
    container.innerHTML = boxes.map(box => createBoxCard(box)).join('');
}

// 搜索盲盒
function searchBoxes() {
    const searchTerm = document.getElementById('searchBox').value.toLowerCase();
    const filteredBoxes = allBoxes.filter(box => 
        box.name.toLowerCase().includes(searchTerm) ||
        box.description.toLowerCase().includes(searchTerm)
    );
    displayBoxes(filteredBoxes);
}

// 筛选盲盒
function filterBoxes() {
    const category = document.getElementById('categoryFilter').value;
    const filteredBoxes = category ? 
        allBoxes.filter(box => box.category === category) : 
        allBoxes;
    displayBoxes(filteredBoxes);
}

// 显示盲盒详情
async function showBoxDetails(boxId) {
    try {
        const box = await mockAPI.getBoxDetails(boxId);
        const items = await mockAPI.getBoxItems(boxId);
        
        const content = `
            <h3>${box.name}</h3>
            <div style="text-align: center; margin: 2rem 0;">
                ${create3DBox(box.rarity)}
            </div>
            <p><strong>描述:</strong> ${box.description}</p>
            <p><strong>价格:</strong> ¥${box.price}</p>
            <p><strong>库存:</strong> ${box.stock}</p>
            <p><strong>稀有度:</strong> ${getRarityText(box.rarity)}</p>
            
            <h4 style="margin-top: 2rem;">可能获得的物品:</h4>
            <div class="items-preview">
                ${items.map(item => `
                    <div class="item-preview">
                        <span class="item-name">${item.name}</span>
                        <span class="item-rarity ${item.rarity}">${getRarityText(item.rarity)}</span>
                        <span class="item-probability">${(item.probability * 100).toFixed(1)}%</span>
                    </div>
                `).join('')}
            </div>
            
            <button class="btn-primary" style="width: 100%; margin-top: 2rem;" 
                    onclick="buyBox(${boxId}); closeModal();">
                购买盲盒 (¥${box.price})
            </button>
        `;
        
        showModal(content);
    } catch (error) {
        showError('加载盲盒详情失败');
    }
}

// 购买盲盒
async function buyBox(boxId) {
    if (!currentUser) {
        showError('请先登录');
        return;
    }
    
    try {
        const result = await mockAPI.buyBox(currentUser.id, boxId);
        if (result.success) {
            // 显示抽取结果
            showDrawResult(result.item);
            // 更新余额
            updateUserBalance(result.newBalance);
            showSuccess(`恭喜获得: ${result.item.name}!`);
        } else {
            showError('购买失败');
        }
    } catch (error) {
        showError('购买过程中出现错误');
    }
}

// 显示抽取结果
function showDrawResult(item) {
    const content = `
        <div class="draw-result">
            <h3>🎉 恭喜获得!</h3>
            <div class="result-item">
                <div class="item-image ${item.rarity}">
                    ${item.name.charAt(0)}
                </div>
                <div class="item-info">
                    <div class="item-name">${item.name}</div>
                    <div class="item-rarity ${item.rarity}">${getRarityText(item.rarity)}</div>
                    <div class="item-description">${item.description}</div>
                </div>
            </div>
            <button class="btn-primary" onclick="closeModal()">确定</button>
        </div>
    `;
    showModal(content);
}
