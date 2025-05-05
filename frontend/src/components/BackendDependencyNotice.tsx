import { useState, useEffect, useRef } from "react";
import { AlertCircle, Server, Database, ArrowRight, RefreshCw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { API_BASE_URL } from "@/lib/api";

export const BackendDependencyNotice = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [backendStatus, setBackendStatus] = useState<'loading' | 'online' | 'offline'>('loading');
  const [reloadCountdown, setReloadCountdown] = useState<number | null>(null);
  const previousStatusRef = useRef<'loading' | 'online' | 'offline'>('loading');
  
  useEffect(() => {
    const checkBackendStatus = async () => {
      try {
        // Try to connect to the backend health endpoint
        const response = await fetch(`${API_BASE_URL}/health`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          // Short timeout to avoid long waits
          signal: AbortSignal.timeout(3000)
        });
        
        if (response.ok) {
          // If status changed from offline to online, trigger auto-reload
          if (previousStatusRef.current === 'offline') {
            setReloadCountdown(3);
          }
          setBackendStatus('online');
        } else {
          setBackendStatus('offline');
        }
      } catch (error) {
        console.error("Backend connection error:", error);
        setBackendStatus('offline');
      }
    };
    
    checkBackendStatus();
    
    // Check more frequently (every 5 seconds) to provide faster feedback
    const intervalId = setInterval(checkBackendStatus, 5000);
    
    return () => clearInterval(intervalId);
  }, []);

  // Update previous status reference when current status changes
  useEffect(() => {
    // Start reload countdown when changing status in either direction
    if ((previousStatusRef.current === 'offline' && backendStatus === 'online') || 
        (previousStatusRef.current === 'online' && backendStatus === 'offline')) {
      setReloadCountdown(3);
    }
    
    // Update the previous status reference
    previousStatusRef.current = backendStatus;
  }, [backendStatus]);

  // Handle auto-reload countdown
  useEffect(() => {
    if (reloadCountdown !== null && reloadCountdown > 0) {
      const timerId = setTimeout(() => {
        setReloadCountdown(reloadCountdown - 1);
      }, 1000);
      
      return () => clearTimeout(timerId);
    } else if (reloadCountdown === 0) {
      // Reload the page when countdown reaches zero
      window.location.reload();
    }
  }, [reloadCountdown]);

  if (!isOpen) return null;

  return (
    <Alert 
      className="mb-4 border-amber-500 bg-amber-50 dark:bg-amber-950 dark:border-amber-800"
    >
      <div className="flex flex-col md:flex-row md:items-center gap-2">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-500" />
          <AlertTitle className="text-amber-800 dark:text-amber-400">
            Backend Dependency Notice
          </AlertTitle>
        </div>
        
        <AlertDescription className="flex-1 text-amber-700 dark:text-amber-300">
          The following features depend on the backend server:
          <ul className="list-disc list-inside ml-4 mt-1">
            <li>Student management (add, edit, view)</li>
            <li>Course management (add, edit, view)</li>
            <li>Examination system (create, schedule)</li>
            <li>Announcements (create, view)</li>
          </ul>
          
          <div className="flex items-center gap-2 mt-2 text-sm">
            <span>Data flow:</span>
            <div className="flex items-center gap-1">
              <span className="px-2 py-1 bg-white dark:bg-amber-900 rounded border border-amber-200 dark:border-amber-700">Frontend</span>
              <ArrowRight className="h-4 w-4" />
              <span className="px-2 py-1 bg-white dark:bg-amber-900 rounded border border-amber-200 dark:border-amber-700 flex items-center gap-1">
                <Server className="h-3 w-3" /> Backend
              </span>
              <ArrowRight className="h-4 w-4" />
              <span className="px-2 py-1 bg-white dark:bg-amber-900 rounded border border-amber-200 dark:border-amber-700 flex items-center gap-1">
                <Database className="h-3 w-3" /> MongoDB
              </span>
            </div>
          </div>
          
          <div className="mt-3 flex items-center gap-2 flex-wrap">
            <span>Backend status:</span>
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
              backendStatus === 'online' 
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                : backendStatus === 'loading'
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
            }`}>
              <span className={`w-2 h-2 rounded-full ${
                backendStatus === 'online' 
                  ? 'bg-green-500' 
                  : backendStatus === 'loading'
                    ? 'bg-blue-500'
                    : 'bg-red-500'
              }`}></span>
              {backendStatus === 'online' 
                ? 'Connected' 
                : backendStatus === 'loading' 
                  ? 'Checking...' 
                  : 'Disconnected'}
            </span>
            
            {backendStatus === 'offline' && (
              <span className="text-xs text-amber-700 dark:text-amber-300">
                Run <code className="bg-amber-100 dark:bg-amber-800 px-1 rounded">npm run backend</code> to start the server
              </span>
            )}

            {reloadCountdown !== null && (
              <span className="inline-flex items-center gap-1 text-xs text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-950 px-2 py-1 rounded-full">
                <RefreshCw className="h-3 w-3 animate-spin" />
                Reloading in {reloadCountdown}s...
              </span>
            )}
          </div>
        </AlertDescription>
        
        <div className="flex gap-2 self-end md:self-center">
          {backendStatus === 'online' && (
            <Button 
              variant="outline"
              className="border-green-500 bg-transparent hover:bg-green-100 text-green-700 dark:text-green-300 dark:hover:bg-green-900"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Now
            </Button>
          )}
          <Button 
            variant="outline"
            className="border-amber-500 bg-transparent hover:bg-amber-100 text-amber-700 dark:text-amber-300 dark:hover:bg-amber-900"
            onClick={() => setIsOpen(false)}
          >
            Dismiss
          </Button>
        </div>
      </div>
    </Alert>
  );
}; 