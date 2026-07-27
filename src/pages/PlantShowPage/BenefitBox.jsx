const BenefitBox = (props) => {
  const { icon, title, description } = props;
  return (
    <div className="flex flex-col items-center  my-4 py-4 px-3">
      <i className={`${icon} text-emerald-700 text-2xl`}></i>
      <div className=" my-2 text-slate-700">{title}</div>
      <div className="text-center text-sm text-slate-500">{description}</div>
    </div>
  );
};

export default BenefitBox;
