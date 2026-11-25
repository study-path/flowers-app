import NavBar from "shared-components/NavBar";
import RedirectToSignInIfSignedOut from "shared-components/RedirectToSignInIfSignedOut";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as plantService from "services/plant";
import LoadingSpinner from "shared-components/LoadingSpinner";
import PlantInfoSection from "./PlantInfoSection";

const PlantShowPage = () => {
  const { plantId } = useParams();
  const navigate = useNavigate();

  const [plant, setPlant] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      //setIsLoading(true);
      const response = await plantService.getPlantById({ id: plantId });

      // for example an old link to a plant that is no longer sold
      if (!response.ok) {
        navigate("/plants", { replace: true });
        return;
      }

      setPlant(await response.json());
      setIsLoading(false);
    })();
  }, [plantId, navigate]);

  return (
    <RedirectToSignInIfSignedOut>
      <NavBar />
      <div className="flex justify-center bg-green-50 min-h-screen font-lato">
        <div className="w-full max-w-5xl px-8 py-24">
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <PlantInfoSection plant={plant}></PlantInfoSection>
          )}
        </div>
      </div>
    </RedirectToSignInIfSignedOut>
  );
};
export default PlantShowPage;
