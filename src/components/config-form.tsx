import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { saveConfigData } from '@/utils/storage'
import type { ConfigData } from '@/types'

interface ConfigFormProps {
  data: ConfigData
  onDataChange: (data: ConfigData) => void
  className?: string
}

export function ConfigForm({ data, onDataChange, className }: ConfigFormProps) {
  const handleFieldChange = (key: string, value: string | boolean) => {
    const newData = {
      ...data,
      [key]: typeof value === 'boolean' ? (value ? 'true' : 'false') : value
    }
    onDataChange(newData)
    saveConfigData(newData)
  }
  
  const getFieldValue = (key: string, defaultValue = ''): string => {
    return data[key] || defaultValue
  }
  
  const getBooleanValue = (key: string, defaultValue = false): boolean => {
    const value = data[key]
    if (value === 'true' || value === '1') return true
    if (value === 'false' || value === '0') return false
    return defaultValue
  }
  
  return (
    <div className={className}>
      <div className="space-y-6">
        {/* Database Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Database Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="database-url">Database URL</Label>
              <Input
                id="database-url"
                placeholder="sqlite:///app/backend/data/webui.db"
                value={getFieldValue('DATABASE_URL')}
                onChange={(e) => handleFieldChange('DATABASE_URL', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
        
        {/* Authentication */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Authentication</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="webui-secret-key">WebUI Secret Key</Label>
              <Input
                id="webui-secret-key"
                type="password"
                placeholder="Enter a secret key for JWT tokens"
                value={getFieldValue('WEBUI_SECRET_KEY')}
                onChange={(e) => handleFieldChange('WEBUI_SECRET_KEY', e.target.value)}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="enable-signup"
                checked={getBooleanValue('ENABLE_SIGNUP', true)}
                onCheckedChange={(checked) => handleFieldChange('ENABLE_SIGNUP', checked)}
              />
              <Label htmlFor="enable-signup">Enable user signup</Label>
            </div>
          </CardContent>
        </Card>
        
        {/* OpenAI API */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">OpenAI Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="openai-api-key">OpenAI API Key</Label>
              <Input
                id="openai-api-key"
                type="password"
                placeholder="sk-..."
                value={getFieldValue('OPENAI_API_KEY')}
                onChange={(e) => handleFieldChange('OPENAI_API_KEY', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="openai-api-base-url">OpenAI API Base URL</Label>
              <Input
                id="openai-api-base-url"
                placeholder="https://api.openai.com/v1"
                value={getFieldValue('OPENAI_API_BASE_URL')}
                onChange={(e) => handleFieldChange('OPENAI_API_BASE_URL', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
        
        {/* Server Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Server Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="port">Port</Label>
              <Input
                id="port"
                type="number"
                placeholder="8080"
                value={getFieldValue('PORT')}
                onChange={(e) => handleFieldChange('PORT', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="host">Host</Label>
              <Input
                id="host"
                placeholder="0.0.0.0"
                value={getFieldValue('HOST')}
                onChange={(e) => handleFieldChange('HOST', e.target.value)}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="debug-mode"
                checked={getBooleanValue('DEBUG', false)}
                onCheckedChange={(checked) => handleFieldChange('DEBUG', checked)}
              />
              <Label htmlFor="debug-mode">Enable debug mode</Label>
            </div>
          </CardContent>
        </Card>
        
        {/* Custom Environment Variables */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Custom Variables</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="custom-vars">Additional Environment Variables</Label>
              <Textarea
                id="custom-vars"
                placeholder="Add custom environment variables (one per line):
CUSTOM_VAR=value
ANOTHER_VAR=another_value"
                value={getFieldValue('_CUSTOM_VARS')}
                onChange={(e) => handleFieldChange('_CUSTOM_VARS', e.target.value)}
                className="min-h-[100px]"
              />
              <div className="text-xs text-muted-foreground">
                Enter additional variables in KEY=VALUE format, one per line
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}