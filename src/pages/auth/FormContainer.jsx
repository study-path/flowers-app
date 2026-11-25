import Logo from "shared-components/Logo";

const FormContainer = (props) => {
  const { children } = props;
  return (
    <div className="flex ">
      <div className="relative hidden md:flex">
        <img
          src="/images/sign_in_scene.jpg"
          alt=""
          className="h-screen object-cover"
        />
        {/* adjust image color to dark and green */}

        <div className="absolute top-0 left-0 w-full h-full bg-black/10"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-green-700/30"></div>
      </div>

      <div className="flex flex-1 items-center justify-center  h-screen bg-green-50">
        <div className=" flex flex-col items-center my-8">
          <Logo className="w-32 mb-2 text-emerald-700" />

          <div className="font-playfair text-emerald-700 text-3xl my-3">
            Home Plants
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default FormContainer;
