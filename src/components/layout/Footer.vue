<template>
  <footer class="glass-card mt-16">
    <div class="container mx-auto px-4 py-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- Logo和简介 -->
        <div class="col-span-1 md:col-span-2">
          <div class="flex items-center space-x-3 mb-4">
            <div class="w-10 h-10 bg-gradient-to-br from-accent-400 to-accent-600 rounded-xl flex items-center justify-center">
              <span class="text-white font-bold text-xl">M</span>
            </div>
            <span class="font-title font-bold text-xl text-neutral-text-primary">MystiBox</span>
          </div>
          <p class="text-neutral-text-secondary text-sm leading-relaxed">
            探索神秘的宠物世界，收集可爱的伙伴，体验充满惊喜的开盒乐趣。
          </p>
        </div>
        
        <!-- 快速链接 -->
        <div>
          <h3 class="font-semibold text-neutral-text-primary mb-4">快速链接</h3>
          <ul class="space-y-2">
            <li><RouterLink to="/store" class="text-neutral-text-secondary hover:text-accent-500 text-sm transition-colors">盲盒商店</RouterLink></li>
            <li><RouterLink to="/plaza" class="text-neutral-text-secondary hover:text-accent-500 text-sm transition-colors">宠物广场</RouterLink></li>
            <li><RouterLink to="/my-pets" class="text-neutral-text-secondary hover:text-accent-500 text-sm transition-colors">我的收藏</RouterLink></li>
          </ul>
        </div>
        
        <!-- 联系信息 -->
        <div>
          <h3 class="font-semibold text-neutral-text-primary mb-4">关于我们</h3>
          <ul class="space-y-2">
            <li><a href="#" class="text-neutral-text-secondary hover:text-accent-500 text-sm transition-colors">帮助中心</a></li>
            <li><a href="#" class="text-neutral-text-secondary hover:text-accent-500 text-sm transition-colors">用户协议</a></li>
            <li><a href="#" class="text-neutral-text-secondary hover:text-accent-500 text-sm transition-colors">隐私政策</a></li>
          </ul>
        </div>
      </div>
      
      <div class="border-t border-white/20 mt-8 pt-6 text-center">
        <p class="text-neutral-text-secondary text-sm">
          © 2025 MystiBox. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
// Footer组件不需要额外的逻辑
</script>
