import { useState } from "react";
import Field from "./Field";

const AuthForm = (props) => {
  const { fields, submitButtonLabel } = props;
  const [fieldValues, setFieldValues] = useState(() => {
    const initialState = {};
    for (let field of fields) {
      initialState[field.label] = "";
    }
    return initialState;
  });
  console.log(fieldValues);
  return (
    <div className="flex justify-between items-center  ">
      <div className="flex flex-col items-center ">
        <form className="bg-white border rounded-lg border-slate-300 p-4 m-4 font-lato">
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
          <button className="bg-emerald-700 text-white rounded-lg px-2 py-1 w-full mt-4">
            {submitButtonLabel}
          </button>
        </form>
      </div>
    </div>
  );
};
export default AuthForm;
