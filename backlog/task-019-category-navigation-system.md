# Task 019: Category Navigation System

**Priority:** Medium  
**Estimated Complexity:** Medium  
**Prerequisites:** Task 018 (Form Component Integration)

## Context
Implement hierarchical sidebar navigation with category grouping using existing HierarchicalNavigation and SectionAccordion components, enhancing the form experience with proper section management and navigation.

## Objective
Create a sidebar navigation system that complements the RJSF form with easy navigation between configuration categories and visual progress indicators.

## Technical Requirements

### 1. Navigation Architecture
Transform flat category list into hierarchical structure:
```typescript
// From current flat categories (55 categories)
categories = [
  { name: "App/Backend - General", displayName: "General", order: 1 },
  { name: "App/Backend - Security", displayName: "Security", order: 2 },
  // ...
]

// To hierarchical navigation structure
navigationStructure = {
  "App/Backend": {
    title: "Application & Backend",
    sections: {
      "General": { fields: [...], order: 1 },
      "Security": { fields: [...], order: 2 },
      "Authentication": { fields: [...], order: 3 }
    }
  },
  "Integrations": {
    title: "External Integrations", 
    sections: {
      "AI Providers": { fields: [...], order: 1 },
      "Storage": { fields: [...], order: 2 }
    }
  }
}
```

### 2. Master Layout Component
```tsx
// src/components/ConfigFormLayout.tsx
import { HierarchicalNavigation } from "@/components/ui/navigation/hierarchical-navigation";
import { SectionAccordion } from "@/components/ui/navigation/section-accordion";

export function ConfigFormLayout({ children, currentSection, onSectionChange }) {
  return (
    <div className="flex h-screen">
      <aside className="w-80 border-r bg-muted/40 p-6 overflow-y-auto">
        <HierarchicalNavigation
          items={navigationItems}
          activeId={currentSection}
          onNavigate={onSectionChange}
        />
      </aside>
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
}
```

### 3. Navigation State Management
Implement section tracking and smooth scrolling:
```typescript
// Section management hooks
const useSectionNavigation = () => {
  const [currentSection, setCurrentSection] = useState('general');
  const [sectionProgress, setSectionProgress] = useState(new Map());
  
  const navigateToSection = (sectionId: string) => {
    setCurrentSection(sectionId);
    scrollToSection(sectionId);
  };
  
  const updateSectionProgress = (sectionId: string, completedFields: number, totalFields: number) => {
    setSectionProgress(prev => new Map(prev.set(sectionId, { completedFields, totalFields })));
  };
  
  return { currentSection, sectionProgress, navigateToSection, updateSectionProgress };
};
```

## Deliverables

### Core Components
- `src/components/ConfigFormLayout.tsx` - Master layout with sidebar
- `src/hooks/use-section-navigation.ts` - Navigation state management
- `src/utils/category-parser.ts` - Category hierarchy builder
- `src/utils/section-progress.ts` - Progress tracking utilities

### Navigation Enhancement
- `src/components/ui/navigation/CategoryNavigationItem.tsx` - Enhanced nav items with progress
- `src/components/ui/navigation/SectionProgressIndicator.tsx` - Visual progress indicators
- `src/components/ConfigFormWithNavigation.tsx` - Integrated form + navigation

### Integration Files
- `src/form/SectionAwareObjectTemplate.tsx` - Section-aware object template
- `src/form/NavigationIntegration.tsx` - RJSF + navigation integration

## Acceptance Criteria

**Navigation Features:**
- [ ] Hierarchical sidebar with main categories and subcategories
- [ ] Smooth scrolling to sections on navigation
- [ ] Active section highlighting in navigation
- [ ] Collapsible navigation sections with state persistence

**Progress Tracking:**
- [ ] Visual indicators for section completion status
- [ ] Field completion counting (filled vs. total fields)
- [ ] Progress persistence across sessions
- [ ] Visual feedback for validation errors by section

**User Experience:**
- [ ] Responsive design (collapsible sidebar on mobile)
- [ ] Keyboard navigation support
- [ ] Search/filter functionality in navigation
- [ ] Breadcrumb navigation for deep sections

## Implementation Details

### Category Hierarchy Parser
```typescript
// src/utils/category-parser.ts
interface NavigationCategory {
  id: string;
  title: string;
  description?: string;
  sections: NavigationSection[];
  order: number;
}

interface NavigationSection {
  id: string;
  title: string;
  fieldCount: number;
  fields: string[];
  order: number;
}

export function buildNavigationHierarchy(schema: any, uiSchema: any): NavigationCategory[] {
  // Parse schema structure and build navigation hierarchy
  // Group fields by category patterns
  // Calculate field counts per section
  // Apply ordering from uiSchema
}
```

### Section Progress Tracking
```typescript
// src/utils/section-progress.ts
export interface SectionProgress {
  sectionId: string;
  totalFields: number;
  filledFields: number;
  validFields: number;
  hasErrors: boolean;
  completionPercentage: number;
}

export function calculateSectionProgress(formData: any, sectionFields: string[]): SectionProgress {
  // Count filled fields
  // Count valid fields 
  // Check for validation errors
  // Calculate completion percentage
}
```

### Enhanced Navigation Item
```tsx
// src/components/ui/navigation/CategoryNavigationItem.tsx
export function CategoryNavigationItem({ 
  category, 
  isActive, 
  progress, 
  onNavigate 
}: CategoryNavigationItemProps) {
  return (
    <div className="space-y-2">
      <button 
        onClick={() => onNavigate(category.id)}
        className={cn(
          "w-full text-left p-3 rounded-lg transition-colors",
          isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted"
        )}
      >
        <div className="flex items-center justify-between">
          <span className="font-medium">{category.title}</span>
          <SectionProgressIndicator progress={progress} />
        </div>
        <div className="text-sm text-muted-foreground mt-1">
          {progress.filledFields}/{progress.totalFields} configured
        </div>
      </button>
      
      {/* Subsections */}
      {category.sections.map(section => (
        <SubsectionNavItem 
          key={section.id}
          section={section}
          isActive={currentSection === section.id}
          onNavigate={onNavigate}
        />
      ))}
    </div>
  );
}
```

## Integration with RJSF

### Section-Aware ObjectFieldTemplate
```tsx
// src/form/SectionAwareObjectTemplate.tsx
export default function SectionAwareObjectFieldTemplate(props: ObjectFieldTemplateProps) {
  const { currentSection, updateSectionProgress } = useSectionNavigation();
  
  useEffect(() => {
    // Update progress when form data changes
    const progress = calculateSectionProgress(props.formData, getSectionFields(currentSection));
    updateSectionProgress(currentSection, progress);
  }, [props.formData, currentSection]);
  
  return (
    <CategorySection 
      title={props.title}
      id={getSectionId(props.title)}
      ref={sectionRef}
    >
      <FormSection>
        {props.properties.map(element => element.content)}
      </FormSection>
    </CategorySection>
  );
}
```

## Mobile Responsiveness

### Responsive Layout
- **Desktop:** Fixed sidebar (320px width) + main content
- **Tablet:** Collapsible sidebar with overlay
- **Mobile:** Bottom navigation or drawer-based navigation

### Mobile Navigation Component
```tsx
// src/components/ConfigFormMobileNav.tsx
export function ConfigFormMobileNav({ sections, currentSection, onSectionChange }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="md:hidden">
          <Menu className="h-4 w-4" />
          Navigate Sections
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80">
        <HierarchicalNavigation
          items={sections}
          activeId={currentSection}
          onNavigate={onSectionChange}
          isMobile={true}
        />
      </SheetContent>
    </Sheet>
  );
}
```

## Success Metrics
- **Navigation Efficiency:** < 2 clicks to reach any configuration section
- **Progress Visibility:** Clear completion status for all sections
- **Performance:** Navigation actions complete in < 100ms
- **Responsive Design:** Functional on all screen sizes (320px+)
- **Accessibility:** Full keyboard navigation and screen reader support

## Next Task Dependencies
- Task 020: Legacy Code Cleanup
- Task 021: Enhanced Validation Pipeline