
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
    
    Object.entries(app.components).forEach(([name, code]: [string, any]) => {
      try {
        // Create a functional component based on the generated code
        const ComponentFunction = () => {
          switch (name) {
            case 'TodoList':
            case 'ItemList':
            case 'PostList':
            case 'CompletedTodos':
            case 'UserPosts':
              return (
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold mb-4">{name}</h3>
                  {[1, 2, 3].map(item => (
                    <div key={item} className="p-3 border rounded-lg">
                      <h4 className="font-medium">Sample Item {item}</h4>
                      <p className="text-sm text-muted-foreground">Sample description</p>
                    </div>
                  ))}
                </div>
              );
              
            case 'AddTodoForm':
            case 'ItemForm':
            case 'PostForm':
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
              
            case 'WelcomeCard':
            case 'UserProfile':
              return (
                <Card className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{name}</h3>
                  <p className="text-sm text-muted-foreground">Welcome to your app</p>
                </Card>
              );
              
            case 'CreatePostButton':
            case 'AddButton':
              return (
                <Button className="w-full">
                  {name.includes('Post') ? 'Create New Post' : 'Add Item'}
                </Button>
              );
              
            default:
              return (
                <div className="p-4 border rounded-lg">
                  <h3 className="text-lg font-semibold">{name}</h3>
                  <p className="text-sm text-muted-foreground">Functional component</p>
                </div>
              );
          }
        };
        
        componentMap[name] = ComponentFunction;
      } catch (error) {
        console.error(`Error creating component ${name}:`, error);
      }
    });

    return componentMap;
  }, [app.components]);

  const currentPageData = app.pages.find((p: any) => p.name === currentPage);
  
  if (!currentPageData) {
    return <div>Page not found</div>;
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
