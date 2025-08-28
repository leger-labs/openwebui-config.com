import type { ConfigData, AppMode } from '@/types'

const STORAGE_KEYS = {
  CONFIG_DATA: 'openwebui-config-data',
  RAW_CONTENT: 'openwebui-raw-content',
  APP_MODE: 'openwebui-app-mode'
}

export function saveConfigData(data: ConfigData): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CONFIG_DATA, JSON.stringify(data))
  } catch (error) {
    console.warn('Failed to save config data to localStorage:', error)
  }
}

export function loadConfigData(): ConfigData {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.CONFIG_DATA)
    return stored ? JSON.parse(stored) : {}
  } catch (error) {
    console.warn('Failed to load config data from localStorage:', error)
    return {}
  }
}

export function saveRawContent(content: string): void {
  try {
    localStorage.setItem(STORAGE_KEYS.RAW_CONTENT, content)
  } catch (error) {
    console.warn('Failed to save raw content to localStorage:', error)
  }
}

export function loadRawContent(): string {
  try {
    return localStorage.getItem(STORAGE_KEYS.RAW_CONTENT) || ''
  } catch (error) {
    console.warn('Failed to load raw content from localStorage:', error)
    return ''
  }
}

export function saveAppMode(mode: AppMode): void {
  try {
    localStorage.setItem(STORAGE_KEYS.APP_MODE, mode)
  } catch (error) {
    console.warn('Failed to save app mode to localStorage:', error)
  }
}

export function loadAppMode(): AppMode {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.APP_MODE)
    return (stored === 'form' || stored === 'raw') ? stored : 'form'
  } catch (error) {
    console.warn('Failed to load app mode from localStorage:', error)
    return 'form'
  }
}

export function clearAllData(): void {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key)
    })
  } catch (error) {
    console.warn('Failed to clear localStorage:', error)
  }
}