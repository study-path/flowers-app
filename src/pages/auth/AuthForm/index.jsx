import { useState } from "react";
import Field from "./Field";

const AuthForm = (props) => {
  const { fields, submitButtonLabel, onSubmit } = props;
  const [fieldValues, setFieldValues] = useState(() => {
    const initialState = {};
    for (let field of fields) {
      initialState[field.label] = "";
    }
    return initialState;
  });

  const [loading, setLoading] = useState(false);

  return (
    <div className="flex justify-between items-center  ">
      <div className="flex flex-col items-center ">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setLoading(true);
            await onSubmit(fieldValues);
            setLoading(false);
          }}
          className="bg-white border rounded-lg border-slate-300 p-4 m-4 font-lato"
        >
          {fields.map((field) => (
            <Field
              key={field.label}
              label={field.label}
              type={field.type}
              value={fieldValues[field.label]}
              onChange={(e) => {
                setFieldValues({
                  ...fieldValues,
                  [field.label]: e.target.value,
                });
              }}
            />
          ))}
          <button className="relative bg-emerald-700 text-white rounded-lg px-2 py-1 w-full mt-4">
            {submitButtonLabel}
            {loading && (
              <div className="absolute top-0 right-4 flex items-center h-full">
                <i className="animate-spin fa-solid fa-spinner-third text-green-400 text-xl"></i>
              </div>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
export default AuthForm;
