const PlantHeading = ({ plant }) => {
  return (
    <div>
      <div className="flex justify-between items-center text-emerald-700 ">
        <div className="font-playfair text-4xl">{plant.name}</div>
        <div className="text-3xl">${plant.price}</div>
      </div>
      <div className="pl-px my-2  italic text-slate-500 text-lg">
        {plant.botanical_name}
      </div>
    </div>
  );
};
export default PlantHeading;
