const PageLoader = () => {
  return (
    <div className="souk-page-loader">
      <div className="souk-loader-content">
        <div className="souk-loader-mark">
          <span>S</span>
        </div>

        <div className="souk-loader-spinner"></div>

        <p>Souk Fashion House</p>
        <span className="souk-loader-subtitle">
          Curating your experience
        </span>
      </div>
    </div>
  );
};

export default PageLoader;