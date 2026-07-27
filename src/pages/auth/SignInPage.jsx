import { useState, useContext } from "react";
import AuthForm from "./AuthForm";
import { Link, useLocation, useNavigate } from "react-router-dom";
import FormContainer from "./FormContainer";
import * as userService from "services/user.js";
import SessionContext from "contexts/SessionContext";
import RedirectToPlantsIfSignedIn from "shared-components/RedirectToPlantsIfSignedIn.jsx";

const SignInPage = () => {
  const [error, setError] = useState("");
  const location = useLocation();
  const sessionContext = useContext(SessionContext);
  const navigate = useNavigate();

  return (
    <RedirectToPlantsIfSignedIn>
      <FormContainer>
        <div className="text-red-700 font-lato">{error}</div>
        {location.state?.accountCreated && (
          <div className=" text-emerald-700 border border-emerald-700 rounded-lg p-4 mt-2">
            Account created successfully. Please sign in.
          </div>
        )}

        <AuthForm
          fields={[
            { label: "username", type: "text" },
            { label: "password", type: "password" },
          ]}
          submitButtonLabel="sign in"
          onSubmit={async (values) => {
            const response = await userService.createSession({
              username: values.username,
              password: values.password,
            });
            const data = await response.json();

            if (response.status === 201) {
              sessionContext.signIn(data.capstone_session_token);
              navigate("/plants");
              setError("");
            } else {
              setError(data.error);
            }
          }}
        />
        <Link to="/signup" className="text-green-600 text-sm underline">
          create an account
        </Link>
      </FormContainer>
    </RedirectToPlantsIfSignedIn>
  );
};
export default SignInPage;
