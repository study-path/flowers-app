const Field = (props) => {
  const { label, type, value, onChange } = props;
  return (
    <div className="mb-4">
      <label
        className="flex  text-slate-500 text-sm font-bold mb-2"
        htmlFor={label}
      >
        {label}
      </label>
      <input
        id={label}
        type={type}
        value={value}
        onChange={onChange}
        className="border border-slate-200 bg-slate-50 rounded-lg px-2 py-1 focus:outline-emerald-600 w-64"
      />
    </div>
  );
};
export default Field;
