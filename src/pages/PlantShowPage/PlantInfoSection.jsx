import BenefitBox from "./BenefitBox";
import PlantHeading from "./PlantHeading";
import PlanPurchaseOption from "./PlanPurchaseOption";
import { useState } from "react";
import { getRandomIdx } from "shared-components/util";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

const PlantInfoSection = (props) => {
  const { plant } = props;

  const [imageIdx, setImageIdx] = useState(() => getRandomIdx(plant.images));

  return (
    <div className="flex md:flex-row flex-col">
      <div className="flex flex-col flex-1">
        <div className="block md:hidden mb-8">
          <PlantHeading plant={plant} />
        </div>
        <Zoom>
          <img className="rounded-lg" src={plant.images[imageIdx].src} />
        </Zoom>

        <div className="flex justify-between mt-2 ">
          <BenefitBox
            icon="fa-regular fa-circle-check"
            title="Guaranteed Healthy"
            description="Guaranteed to arrive healthy or your money back"
          />
          <div className="bg-slate-300 w-px "></div>
          <BenefitBox
            icon="fa-regular fa-truck-fast"
            title="Free shipping"
            description="Get free ground shippingon orders over $50"
          />
        </div>
      </div>
      <div className="flex flex-col flex-1 md:px-8 ">
        <div className="hidden md:block">
          <PlantHeading plant={plant} />
        </div>
        <p className="text-slate-600 leading-relaxed my-4">
          {plant.description}
        </p>
        <PlanPurchaseOption
          plant={plant}
          imageIdx={imageIdx}
          setImageIdx={setImageIdx}
        />
      </div>
    </div>
  );
};
export default PlantInfoSection;
