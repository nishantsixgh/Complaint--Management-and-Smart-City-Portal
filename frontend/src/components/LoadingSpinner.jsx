const LoadingSpinner = ({ text = "Loading..." }) => {
  return (
    <div className="container py-5 text-center">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">{text}</span>
      </div>
      <p className="text-muted mt-3 mb-0">{text}</p>
    </div>
  );
};

export default LoadingSpinner;
