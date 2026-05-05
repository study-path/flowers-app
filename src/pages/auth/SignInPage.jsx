import AuthForm from "./AuthForm";
import { Link } from "react-router-dom";
import FormContainer from "./FormContainer";
const SignInPage = () => {
  return (
    <FormContainer>
      <AuthForm
        fields={[
          { label: "username", type: "text" },
          { label: "password", type: "password" },
        ]}
        submitButtonLabel="sign in"
      />
      <Link to="/signup" className="text-green-600 text-sm   underline">
        create an account
      </Link>
    </FormContainer>
  );
};
export default SignInPage;
