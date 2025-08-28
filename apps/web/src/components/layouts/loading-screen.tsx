interface LoadingScreenProps {
  message?: string;
}

export function LoadingScreen({ message = "Loading..." }: LoadingScreenProps) {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-4">
      <div className="flex items-center gap-3">
        {/* Loader icon */}
        <div className="border-muted-foreground/30 border-t-foreground h-6 w-6 animate-spin rounded-full border-2"></div>

        {/* Loading message */}
        <span className="text-muted-foreground font-medium">{message}</span>
      </div>
    </div>
  );
}
