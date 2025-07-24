/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 主色调 - 天空与海洋
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#87CEEB', // 柔和天空蓝
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        // 辅助色 - 阳光与活力
        secondary: {
          50: '#fefce8',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#FFDAB9', // 蜜桃橘
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        // 强调色 - 活力珊瑚粉
        accent: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#FF6F61', // 活力珊瑚粉
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        // 稀有度颜色
        rarity: {
          normal: '#B0C4DE',    // 柔和石灰
          rare: '#89CFF0',      // 星光蓝
          sr: '#9370DB',        // 神秘紫罗兰
          ssr: '#FFD700',       // 辉煌流金
        },
        // 中性色
        neutral: {
          bg: '#F9F9F9',
          text: {
            primary: '#333333',
            secondary: '#666666',
            disabled: '#AAAAAA',
          },
          border: '#EAEAEA',
        },
        // 状态色
        success: '#28a745',
        warning: '#ffc107',
        error: '#dc3545',
      },
      fontFamily: {
        'title': ['Nunito', 'sans-serif'],
        'body': ['Lato', 'sans-serif'],
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'sparkle': 'sparkle 1.5s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(255, 111, 97, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(255, 111, 97, 0.8)' },
        },
        sparkle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.5', transform: 'scale(1.1)' },
        },
      },
    },
  },
  plugins: [],
}