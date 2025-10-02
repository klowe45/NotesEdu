const FormSample = ({
  title,
  description,
  onSubmit,
  submitText = "Submit",
  isSubmitDisabled = false,
  children,
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(e);
    }
  };

  return (
    <div className="flex m-0">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col mt-10 border border-black/40 rounded-xl w-full p-2"
      >
        {title && <h3 className="text-xl font-semibold mb-2 px-1">{title}</h3>}
        {description && (
          <p className="text-gray-600 mb-4 px-1">{description}</p>
        )}

        <div className="flex flex-col w-full p-1">{children}</div>

        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          disabled={isSubmitDisabled}
        >
          {submitText}
        </button>
      </form>
    </div>
  );
};

export default FormSample;
