import React, { useState } from 'react'
import { FieldProps } from '@rjsf/core'
import { OverrideableField } from '@/components/ui/form/wrappers/overrideable-field'

export default function OverrideableFieldWrapper(props: FieldProps) {
  const isOverrideable = props.uiSchema?.['ui:overrideable']
  const defaultValue = props.schema.default
  const [isOverridden, setIsOverridden] = useState(false)
  
  // If not overrideable, render the default field
  if (!isOverrideable) {
    const DefaultFieldTemplate = props.registry.templates.FieldTemplate
    return <DefaultFieldTemplate {...props} />
  }
  
  const handleOverride = (overridden: boolean) => {
    setIsOverridden(overridden)
    if (!overridden && defaultValue !== undefined) {
      // Reset to default value
      props.onChange(defaultValue)
    }
  }
  
  // Wrap the field with override capability
  return (
    <OverrideableField 
      defaultValue={defaultValue}
      onOverride={handleOverride}
    >
      {React.createElement(props.registry.templates.FieldTemplate, {
        ...props,
        disabled: !isOverridden && defaultValue !== undefined
      })}
    </OverrideableField>
  )
}