import type { ConfigData, AppMode } from './index'

// Storage-specific types for enhanced localStorage functionality
export interface StorageConfig {
  key: string
  value: string | ConfigData | AppMode
  timestamp: number
  version?: string
  checksum?: string
  metadata?: StorageMetadata
}

export interface StorageMetadata {
  userAgent?: string
  source?: 'form' | 'raw' | 'import'
  fileSize?: number
  configurationCount?: number
}

export interface StorageHistory {
  configs: StorageConfig[]
  maxSize: number
  lastCleanup?: number
}

export interface AutoSaveOptions {
  enabled: boolean
  debounceMs: number
  maxHistorySize: number
  enableVersioning?: boolean
  enableChecksum?: boolean
}

export interface StorageQuotaInfo {
  used: number
  available: number
  quota: number
  percentage: number
  isNearQuota: boolean
  isExceeded: boolean
}

export interface StorageMigration {
  fromVersion: string
  toVersion: string
  migrationFunction: (data: any) => any
  description: string
}

export interface StorageBackup {
  timestamp: number
  version: string
  data: {
    configData: ConfigData
    rawContent: string
    appMode: AppMode
    autoSaveOptions: AutoSaveOptions
    history: StorageHistory
  }
  metadata: {
    userAgent: string
    appVersion: string
    configCount: number
  }
}

export interface StorageExport {
  format: 'json' | 'env' | 'backup'
  includeHistory: boolean
  includeMetadata: boolean
  encryptData?: boolean
}

export interface StorageImport {
  data: any
  format: 'json' | 'env' | 'backup'
  validateData: boolean
  mergeStrategy: 'replace' | 'merge' | 'append'
}

// Storage events for advanced features
export interface StorageEvent {
  type: 'save' | 'load' | 'clear' | 'migrate' | 'quota_exceeded' | 'backup_created'
  timestamp: number
  details: {
    key?: string
    success: boolean
    error?: string
    metadata?: any
  }
}

export interface StorageWatcher {
  id: string
  keys: string[]
  callback: (event: StorageEvent) => void
  enabled: boolean
}

// Storage configuration schema for different environments
export interface StorageEnvironmentConfig {
  maxHistorySize: number
  autoSaveEnabled: boolean
  debounceMs: number
  enableCompression: boolean
  enableEncryption: boolean
  quotaThreshold: number // Percentage of quota before warnings
  cleanupThreshold: number // Days after which to cleanup old entries
}

// Default configurations for different use cases
export const STORAGE_ENVIRONMENTS: Record<string, StorageEnvironmentConfig> = {
  development: {
    maxHistorySize: 20,
    autoSaveEnabled: true,
    debounceMs: 500,
    enableCompression: false,
    enableEncryption: false,
    quotaThreshold: 90,
    cleanupThreshold: 7
  },
  production: {
    maxHistorySize: 10,
    autoSaveEnabled: true,
    debounceMs: 1000,
    enableCompression: true,
    enableEncryption: false,
    quotaThreshold: 80,
    cleanupThreshold: 3
  },
  minimal: {
    maxHistorySize: 5,
    autoSaveEnabled: false,
    debounceMs: 2000,
    enableCompression: true,
    enableEncryption: false,
    quotaThreshold: 70,
    cleanupThreshold: 1
  }
}