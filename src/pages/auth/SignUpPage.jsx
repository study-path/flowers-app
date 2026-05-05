import AuthForm from "./AuthForm";
import { Link } from "react-router-dom";
import FormContainer from "./FormContainer";
const SignUpPage = () => {
  return (
    <FormContainer>
      <AuthForm
        fields={[
          { label: "username", type: "text" },
          { label: "password", type: "password" },
          { label: "confirm password", type: "password" },
        ]}
        submitButtonLabel="create account"
      />
      <Link to="/" className="text-green-600 text-sm   underline">
        sign in
      </Link>
    </FormContainer>
  );
};
export default SignUpPage;
