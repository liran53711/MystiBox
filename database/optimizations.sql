-- 添加一些有用的索引
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_blind_boxes_category ON blind_boxes(category);
CREATE INDEX IF NOT EXISTS idx_box_items_blind_box ON box_items(blind_box_id);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_user_items_user ON user_items(user_id);
CREATE INDEX IF NOT EXISTS idx_friendships_user ON friendships(user_id);
CREATE INDEX IF NOT EXISTS idx_friend_requests_to_user ON friend_requests(to_user_id);

-- 添加一些测试数据
INSERT OR IGNORE INTO users (username, password, email, balance) VALUES 
('admin', 'admin123', 'admin@mystibox.com', 1000.00),
('testuser', 'test123', 'test@example.com', 100.00);

INSERT OR IGNORE INTO blind_boxes (name, description, price, stock, category) VALUES 
('神秘宝箱', '包含各种稀有物品的神秘盲盒', 29.99, 100, 'mystery'),
('动漫手办盒', '精美动漫手办收集', 49.99, 50, 'figure');