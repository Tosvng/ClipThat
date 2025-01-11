const StatusBar = () => {
  return (
    <div className="h-6 bg-charcoal border-t border-gold/20 flex items-center px-4 text-xs text-cream/60">
      <div className="flex items-center space-x-4">
        <span>Ready</span>
        <div className="w-[1px] h-3 bg-gold/20" />
        <span>Version 2.3.2</span>
      </div>
    </div>
  );
};

export default StatusBar;
