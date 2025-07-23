
import React, { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface GeneratedAppRendererProps {
  app: any;
  currentPage: string;
  onPageChange: (page: string) => void;
}

const GeneratedAppRenderer: React.FC<GeneratedAppRendererProps> = ({
  app,
  currentPage,
  onPageChange
}) => {
  const ComponentRenderer = useMemo(() => {
    // Create a component map from the generated code
    const componentMap: Record<string, React.ComponentType> = {};
    
    if (!app?.components) return componentMap;
    
    Object.entries(app.components).forEach(([name, code]: [string, any]) => {
      try {
        // If code is a string (generated React component), create a mock component
        // In a real implementation, this would be dynamically compiled
        if (typeof code === 'string') {
          const ComponentFunction = () => {
            // Parse the component type from the generated code
            if (code.includes('useState') && code.includes('form')) {
              // Form component
              return (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold mb-4">{name}</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">Title</label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded-md"
                        placeholder="Enter title"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Description</label>
                      <textarea
                        className="w-full p-2 border rounded-md"
                        placeholder="Enter description"
                        rows={3}
                      />
                    </div>
                    <Button className="w-full">Submit</Button>
                  </div>
                </div>
              );
            } else if (code.includes('items.map')) {
              // List component
              return (
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold mb-4">{name}</h3>
                  {[1, 2, 3].map(item => (
                    <div key={item} className="p-3 border rounded-lg">
                      <h4 className="font-medium">Sample Item {item}</h4>
                      <p className="text-sm text-muted-foreground">Sample description for item {item}</p>
                    </div>
                  ))}
                </div>
              );
            } else if (code.includes('Card')) {
              // Card component
              return (
                <Card className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{name}</h3>
                  <p className="text-sm text-muted-foreground">This is a {name} component</p>
                </Card>
              );
            } else if (code.includes('Button')) {
              // Button component
              return (
                <Button className="w-full">
                  {name.replace(/([A-Z])/g, ' $1').trim()}
                </Button>
              );
            } else {
              // Default component
              return (
                <div className="p-4 border rounded-lg">
                  <h3 className="text-lg font-semibold">{name}</h3>
                  <p className="text-sm text-muted-foreground">Generated functional component</p>
                </div>
              );
            }
          };
          
          componentMap[name] = ComponentFunction;
        } else {
          // Fallback for old object format
          const ComponentFunction = () => {
            return (
              <div className="p-4 border rounded-lg">
                <h3 className="text-lg font-semibold">{name}</h3>
                <p className="text-sm text-muted-foreground">Legacy component format</p>
              </div>
            );
          };
          
          componentMap[name] = ComponentFunction;
        }
      } catch (error) {
        console.error(`Error creating component ${name}:`, error);
        // Create an error component
        componentMap[name] = () => (
          <div className="p-4 border border-red-200 rounded-lg">
            <p className="text-red-600">Error loading component {name}</p>
          </div>
        );
      }
    });

    return componentMap;
  }, [app.components]);

  // Add null checks for app structure
  if (!app || !app.pages || !Array.isArray(app.pages)) {
    return <div>No app data available</div>;
  }

  const currentPageData = app.pages.find((p: any) => p.name === currentPage);
  
  if (!currentPageData) {
    return <div>Page not found</div>;
  }

  // Add null check for components array
  if (!currentPageData.components || !Array.isArray(currentPageData.components)) {
    return <div>No components found for this page</div>;
  }

  return (
    <div className="space-y-4">
      {currentPageData.components.map((componentName: string, index: number) => {
        const Component = ComponentRenderer[componentName];
        if (!Component) {
          return (
            <div key={index} className="p-4 border border-red-200 rounded-lg">
              <p className="text-red-600">Component {componentName} not found</p>
            </div>
          );
        }
        return <Component key={index} />;
      })}
    </div>
  );
};

export default GeneratedAppRenderer;
