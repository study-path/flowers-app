import { useEffect, useState } from "react";
import NavBar from "shared-components/NavBar";
import RedirectToSignInIfSignedOut from "shared-components/RedirectToSignInIfSignedOut";
import * as plantService from "services/plant";
import PlantItem from "./PlantItem";
import LoadingSpinner from "shared-components/LoadingSpinner";
import { motion } from "motion/react";

const PlantListPage = () => {
  const [plants, setPlants] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const response = await plantService.getPlants();
      const data = await response.json();
      setPlants(data);
      setIsLoading(false);
    })();
  }, []);
  return (
    <RedirectToSignInIfSignedOut>
      <NavBar />
      <div className="min-h-screen bg-green-50">
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="flex justify-center py-20">
            <div className="w-full max-w-5xl">
              <div className="font-playfair text-emerald-700 text-4xl mb-2 px-4">
                Plants in Stock
              </div>
              <div className="flex flex-wrap justify-center">
                {plants.map((plant, idx) => (
                  <motion.div
                    key={plant.name}
                    initial={{ opacity: 0, translateY: "20px" }}
                    whileInView={{ opacity: 1, translateY: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: (idx % 3) * 0.2, duration: 0.5 }}
                  >
                    <PlantItem plant={plant} />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </RedirectToSignInIfSignedOut>
  );
};

export default PlantListPage;
