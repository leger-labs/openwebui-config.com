import React from 'react'
import { FieldProps } from '@rjsf/core'
import { PlanRestrictedFeature } from '@/components/ui/form/wrappers/plan-restricted-feature'

export default function PlanRestrictedField(props: FieldProps) {
  const planRequired = props.uiSchema?.['ui:planRequired']
  
  // If no plan restriction, render the default field
  if (!planRequired) {
    const DefaultFieldTemplate = props.registry.templates.FieldTemplate
    return <DefaultFieldTemplate {...props} />
  }
  
  // Wrap the field with plan restriction
  return (
    <PlanRestrictedFeature planRequired={planRequired as string}>
      {React.createElement(props.registry.templates.FieldTemplate, props)}
    </PlanRestrictedFeature>
  )
}