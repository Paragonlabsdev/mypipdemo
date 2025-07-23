
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
    const componentMap: Record<string, React.ComponentType> = {};
    
    if (!app?.components) return componentMap;
    
    Object.entries(app.components).forEach(([name, config]: [string, any]) => {
      try {
        // Handle both string (React code) and object (config) formats
        let componentType = 'card';
        let props: any = {};
        
        if (typeof config === 'string') {
          // Parse component type from React code string
          if (config.includes('form') || config.includes('Form')) componentType = 'form';
          else if (config.includes('list') || config.includes('List')) componentType = 'list';
          else if (config.includes('Button')) componentType = 'button';
          else componentType = 'card';
        } else if (config && typeof config === 'object') {
          componentType = config.type || 'card';
          props = config.props || {};
        }

        const ComponentFunction = () => {
          switch (componentType) {
            case 'form':
              return (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold mb-4">{props.title || name}</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">Search</label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded-md"
                        placeholder="Enter search term..."
                      />
                    </div>
                    <Button className="w-full">{props.submitText || 'Submit'}</Button>
                  </div>
                </div>
              );

            case 'list':
              const sampleData = name.toLowerCase().includes('food') ? [
                { id: 1, name: 'Apple', calories: '52 cal/100g' },
                { id: 2, name: 'Banana', calories: '89 cal/100g' },
                { id: 3, name: 'Chicken Breast', calories: '165 cal/100g' }
              ] : name.toLowerCase().includes('game') || name.toLowerCase().includes('score') ? [
                { id: 1, name: 'Player1', score: '1250' },
                { id: 2, name: 'Player2', score: '980' },
                { id: 3, name: 'Player3', score: '750' }
              ] : [
                { id: 1, name: 'Task 1', status: 'Pending' },
                { id: 2, name: 'Task 2', status: 'Complete' },
                { id: 3, name: 'Task 3', status: 'In Progress' }
              ];

              return (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold mb-4">{props.title || name}</h3>
                  {sampleData.map(item => (
                    <div key={item.id} className="p-3 border rounded-lg flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {item.calories || item.score || item.status}
                        </p>
                      </div>
                      {name.toLowerCase().includes('calorie') && (
                        <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          Log
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              );

            case 'button':
              return (
                <Button className="w-full" size="lg">
                  {props.text || name.replace(/([A-Z])/g, ' $1').trim()}
                </Button>
              );

            case 'card':
            default:
              return (
                <Card className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{props.title || name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {props.description || `This is the ${name} component`}
                  </p>
                  {name.toLowerCase().includes('progress') && (
                    <div className="mt-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span>1,200 calories</span>
                        <span>2,000 goal</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                      </div>
                    </div>
                  )}
                  {name.toLowerCase().includes('game') && (
                    <div className="mt-4 text-center">
                      <div className="text-4xl mb-2">🎮</div>
                      <p className="text-xs text-muted-foreground">Tap to start playing!</p>
                    </div>
                  )}
                </Card>
              );
          }
        };
        
        componentMap[name] = ComponentFunction;
      } catch (error) {
        console.error(`Error creating component ${name}:`, error);
        componentMap[name] = () => (
          <div className="p-4 border border-red-200 rounded-lg">
            <p className="text-red-600">Error loading {name}</p>
          </div>
        );
      }
    });

    return componentMap;
  }, [app?.components]);

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
