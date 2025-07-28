<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Hero Section -->
    <section class="text-center py-16">
      <h1 class="mb-6" style="font-family: var(--font-heading); font-size: var(--text-4xl); color: var(--color-text-primary); font-weight: 900;">
        欢迎来到 <span style="color: var(--color-accent);">MystiBox</span>
      </h1>
      <p class="mb-8 max-w-2xl mx-auto" style="font-size: var(--text-xl); color: var(--color-text-secondary); font-family: var(--font-body);">
        探索神秘的宠物世界，收集可爱的伙伴，体验充满惊喜的开盒乐趣
      </p>
      <div class="space-x-4">
        <button
          @click="$router.push('/store')"
          class="btn btn-primary"
          style="font-size: var(--text-lg); padding: 16px 32px;"
        >
          🎮 开始探索
        </button>
        <button
          @click="$router.push('/plaza')"
          class="btn btn-secondary"
          style="font-size: var(--text-lg); padding: 16px 32px;"
        >
          🏛️ 宠物广场
        </button>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-16">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="card p-6 text-center">
          <div class="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style="background: var(--color-secondary);">
            <span class="text-2xl">🎁</span>
          </div>
          <h3 class="mb-2" style="font-family: var(--font-heading); font-size: var(--text-xl); color: var(--color-text-primary); font-weight: 700;">神秘盲盒</h3>
          <p style="color: var(--color-text-secondary); font-family: var(--font-body);">每个盲盒都包含惊喜，收集稀有宠物</p>
        </div>

        <div class="card p-6 text-center">
          <div class="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style="background: var(--color-secondary);">
            <span class="text-2xl">🐾</span>
          </div>
          <h3 class="mb-2" style="font-family: var(--font-heading); font-size: var(--text-xl); color: var(--color-text-primary); font-weight: 700;">宠物收藏</h3>
          <p style="color: var(--color-text-secondary); font-family: var(--font-body);">培养你的宠物，建立独特的收藏</p>
        </div>

        <div class="card p-6 text-center">
          <div class="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style="background: var(--color-secondary);">
            <span class="text-2xl">👥</span>
          </div>
          <h3 class="mb-2" style="font-family: var(--font-heading); font-size: var(--text-xl); color: var(--color-text-primary); font-weight: 700;">社区分享</h3>
          <p style="color: var(--color-text-secondary); font-family: var(--font-body);">与其他玩家分享你的宠物收藏</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import BaseButton from '@/components/base/BaseButton.vue'
</script>
