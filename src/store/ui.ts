import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { UserPet } from '@/types'

export const useUiStore = defineStore('ui', () => {
  // State
  const isGachaPlaying = ref(false)
  const gachaResult = ref<UserPet[] | null>(null)
  const showLoginModal = ref(false)
  const showRegisterModal = ref(false)

  // Actions
  function startGacha() {
    isGachaPlaying.value = true
    gachaResult.value = null
  }

  function setGachaResult(pets: UserPet[]) {
    gachaResult.value = pets
  }

  function endGacha() {
    isGachaPlaying.value = false
    gachaResult.value = null
  }

  function openLoginModal() {
    showLoginModal.value = true
    showRegisterModal.value = false
  }

  function openRegisterModal() {
    showRegisterModal.value = true
    showLoginModal.value = false
  }

  function closeLoginModal() {
    showLoginModal.value = false
  }

  function closeRegisterModal() {
    showRegisterModal.value = false
  }

  function closeModals() {
    showLoginModal.value = false
    showRegisterModal.value = false
  }

  return {
    // State
    isGachaPlaying,
    gachaResult,
    showLoginModal,
    showRegisterModal,
    // Actions
    startGacha,
    setGachaResult,
    endGacha,
    openLoginModal,
    openRegisterModal,
    closeLoginModal,
    closeRegisterModal,
    closeModals
  }
})