const PageHeader = ({ title, description }) => {
  return (
    <div className="mb-8 text-center">
      <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
        {title}
      </h1>

      {description && (
        <p className="mx-auto mt-2 max-w-2xl text-base text-gray-600">
          {description}
        </p>
      )}
    </div>
  );
};

export default PageHeader;
