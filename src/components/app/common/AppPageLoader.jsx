const AppPageLoader = () => {
  return (
    <div className="fixed inset-0 bg-gray-100 bg-opacity-10 flex items-center justify-center z-50">
      <div className="w-16 h-16 border-4 border-t-transparent border-muted-foreground/50 rounded-full animate-spin"></div>
    </div>
  );
};
export default AppPageLoader;
