export type AppMode = 'form' | 'raw'

export interface EnvVariable {
  key: string
  value: string
  comment?: string
}

export interface ConfigData {
  [key: string]: string | undefined
}

export interface AppState {
  mode: AppMode
  configData: ConfigData
  rawContent: string
}

export interface ValidationError {
  field: string
  message: string
}

export interface ImportResult {
  success: boolean
  data?: ConfigData
  errors?: ValidationError[]
}

export interface ExportResult {
  success: boolean
  content?: string
  error?: string
}

export interface StorageConfig {
  key: string
  value: string | ConfigData | AppMode
  timestamp: number
  version?: string
}

export interface StorageHistory {
  configs: StorageConfig[]
  maxSize: number
}

export interface AutoSaveOptions {
  enabled: boolean
  debounceMs: number
  maxHistorySize: number
}