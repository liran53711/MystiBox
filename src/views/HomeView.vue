<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Hero Section -->
    <section class="text-center py-16">
      <h1 class="text-5xl font-bold text-neutral-text-primary mb-6">
        欢迎来到 <span class="text-accent-500">MystiBox</span>
      </h1>
      <p class="text-xl text-neutral-text-secondary mb-8 max-w-2xl mx-auto">
        探索神秘的宠物世界，收集可爱的伙伴，体验充满惊喜的开盒乐趣
      </p>
      <div class="space-x-4">
        <BaseButton variant="primary" size="lg" @click="$router.push('/store')">
          开始探索
        </BaseButton>
        <BaseButton variant="outline" size="lg" @click="$router.push('/plaza')">
          宠物广场
        </BaseButton>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-16">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="glass-card p-6 text-center">
          <div class="w-16 h-16 bg-accent-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span class="text-2xl">🎁</span>
          </div>
          <h3 class="text-xl font-semibold text-neutral-text-primary mb-2">神秘盲盒</h3>
          <p class="text-neutral-text-secondary">每个盲盒都包含惊喜，收集稀有宠物</p>
        </div>
        
        <div class="glass-card p-6 text-center">
          <div class="w-16 h-16 bg-accent-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span class="text-2xl">🐾</span>
          </div>
          <h3 class="text-xl font-semibold text-neutral-text-primary mb-2">宠物收藏</h3>
          <p class="text-neutral-text-secondary">培养你的宠物，建立独特的收藏</p>
        </div>
        
        <div class="glass-card p-6 text-center">
          <div class="w-16 h-16 bg-accent-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span class="text-2xl">👥</span>
          </div>
          <h3 class="text-xl font-semibold text-neutral-text-primary mb-2">社区分享</h3>
          <p class="text-neutral-text-secondary">与其他玩家分享你的宠物收藏</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import BaseButton from '@/components/base/BaseButton.vue'
</script>
