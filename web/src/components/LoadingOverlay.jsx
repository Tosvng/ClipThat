const LoadingOverlay = ({ message = "Loading..." }) => (
  <div className="absolute inset-0 bg-charcoal/50 backdrop-blur-sm flex items-center justify-center">
    <div className="text-center space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
      <p className="text-cream">{message}</p>
    </div>
  </div>
);

export default LoadingOverlay;
