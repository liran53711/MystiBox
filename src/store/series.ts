import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Series, Pet, UserPet } from '@/types'
import { seriesAPI } from '@/api/series'

export const useSeriesStore = defineStore('series', () => {
  // State
  const series = ref<Series[]>([])
  const currentSeries = ref<Series | null>(null)
  const isLoading = ref(false)

  // Actions
  async function fetchAllSeries() {
    isLoading.value = true
    try {
      const response = await seriesAPI.getAll()
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
      const response = await seriesAPI.getById(id)
      currentSeries.value = response
      return response
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  async function drawFromSeries(seriesId: string, amount: 1 | 10) {
    try {
      const response = await seriesAPI.draw(seriesId, { amount })
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