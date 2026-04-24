export function PageLoader() {
  return (
    <div
      className="flex min-h-[60vh] flex-col items-center justify-center gap-4 font-mono text-sm tracking-widest text-primary opacity-70"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="h-8 w-8 animate-spin rounded-sm border-l-2 border-t-2 border-primary" />
      <span>[ LOADING_MODULE... ]</span>
    </div>
  );
}
