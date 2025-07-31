import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Series } from '@/types'
import { seriesApi } from '@/api/series'

export const useSeriesStore = defineStore('series', () => {
  // State
  const series = ref<Series[]>([])
  const currentSeries = ref<Series | null>(null)
  const isLoading = ref(false)

  // Actions
  async function fetchAllSeries() {
    isLoading.value = true
    try {
      const response = await seriesApi.getAll()
      series.value = response
      return response
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  async function fetchSeriesById(id: string) {
    isLoading.value = true
    try {
      const response = await seriesApi.getById(Number(id))
      currentSeries.value = response
      return response
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  async function drawFromSeries(seriesId: number, _amount: 1 | 10) {
    try {
      const response = await seriesApi.getById(seriesId)
      return response
    } catch (error) {
      throw error
    }
  }

  return {
    // State
    series,
    currentSeries,
    isLoading,
    // Actions
    fetchAllSeries,
    fetchSeriesById,
    drawFromSeries
  }
})