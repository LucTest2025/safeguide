import { 
  FETCH_REFUGES_REQUEST, 
  FETCH_REFUGES_SUCCESS, 
  FETCH_REFUGES_ERROR,
  FETCH_REFUGE_PHOTOS_SUCCESS 
} from "../constants";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../database/firebaseConfig";

const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

/**
 * 🔹 Action pour récupérer les refuges accessibles (PMR)
 */
export const fetchAccessibleRefuges = (userLocation) => async (dispatch) => {
  try {
    console.log("🔵 Dispatching FETCH_REFUGES_REQUEST...");
    dispatch({ type: FETCH_REFUGES_REQUEST }); // Indiquer que la récupération commence

    // 🔹 Étape 1 : Récupérer les refuges accessibles depuis Firebase
    console.log("📡 Récupération des refuges depuis Firebase...");
    const q = query(collection(db, "refuges"), where("accessible_pmr", "==", true));
    const querySnapshot = await getDocs(q);

    let refuges = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log("✅ Refuges récupérés depuis Firebase:", refuges);

    // 🔹 Étape 2 : Calcul de la distance entre l'utilisateur et chaque refuge
    const calculateDistanceInMeters = (lat1, lon1, lat2, lon2) => {
      const R = 6371000;
      const toRad = (value) => (value * Math.PI) / 180;
      const dLat = toRad(lat2 - lat1);
      const dLon = toRad(lon2 - lon1);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) *
          Math.cos(toRad(lat2)) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    };

    // 🔹 Étape 3 : Ajouter `place_id` et calculer les distances
    const fetchPlaceId = async (refuge) => {
      const url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(
        refuge.nom
      )}&inputtype=textquery&locationbias=point:${refuge.location.lat},${refuge.location.lng}&fields=place_id&key=${GOOGLE_API_KEY}`;

      console.log(`📡 Récupération du place_id pour ${refuge.nom}...`);
      try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.candidates && data.candidates.length > 0) {
          console.log(`✅ Place ID trouvé pour ${refuge.nom}:`, data.candidates[0].place_id);
          return data.candidates[0].place_id;
        }
      } catch (error) {
        console.error(`❌ Erreur lors de la récupération du place_id pour ${refuge.nom}:`, error);
      }
      console.log(`⚠️ Aucun place_id trouvé pour ${refuge.nom}`);
      return null;
    };

    const refugesWithDetails = await Promise.all(
      refuges.map(async (refuge) => {
        const distance = calculateDistanceInMeters(
          userLocation.lat,
          userLocation.lng,
          refuge.location.lat,
          refuge.location.lng
        );

        const placeId = await fetchPlaceId(refuge);

        return {
          ...refuge,
          distance,
          distanceText: `${(distance / 1000).toFixed(2)} km`,
          place_id: placeId,
        };
      })
    );

    console.log("✅ Refuges avec distances et place_id:", refugesWithDetails);

    // 🔹 Étape 4 : Filtrer les refuges dans un rayon de 5 km
    const refugesInRadius = refugesWithDetails.filter((refuge) => refuge.distance <= 5000);
    console.log("✅ Refuges dans un rayon de 5 km:", refugesInRadius);

    // 🔹 Étape 5 : Trier par distance et limiter à 50 refuges max
    const top50Refuges = refugesInRadius.sort((a, b) => a.distance - b.distance).slice(0, 50);
    console.log("✅ Top 50 refuges triés:", top50Refuges);

    console.log("🔵 Dispatching FETCH_REFUGES_SUCCESS...");
    dispatch({
      type: FETCH_REFUGES_SUCCESS,
      payload: top50Refuges,
    });

    console.log("📡 Lancement de la récupération des photos...");
    dispatch(fetchRefugePhotos(top50Refuges));

  } catch (error) {
    console.error("❌ Erreur lors de la récupération des refuges:", error);
    dispatch({
      type: FETCH_REFUGES_ERROR,
      payload: error.message,
    });
  }
};

/**
 * 🔹 Action pour récupérer les photos des refuges via Google Places API
 */
export const fetchRefugePhotos = (refuges) => async (dispatch) => {
  try {
    const photos = {};

    for (let refuge of refuges) {
      if (refuge.place_id) {
        const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${refuge.place_id}&fields=photos&key=${GOOGLE_API_KEY}`;

        console.log(`📡 Récupération de la photo pour ${refuge.nom}...`);
        const response = await fetch(url);
        const data = await response.json();

        if (data.result?.photos?.length > 0) {
          const photoReference = data.result.photos[0].photo_reference;
          photos[refuge.place_id] = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${GOOGLE_API_KEY}`;
          console.log(`✅ Photo trouvée pour ${refuge.nom}:`, photos[refuge.place_id]);
        } else {
          console.log(`⚠️ Aucune photo trouvée pour ${refuge.nom}`);
        }
      } else {
        console.log(`⚠️ Place ID manquant pour ${refuge.nom}, aucune photo récupérée.`);
      }
    }

    console.log("✅ Photos récupérées:", photos);

    console.log("🔵 Dispatching FETCH_REFUGE_PHOTOS_SUCCESS...");
    dispatch({
      type: FETCH_REFUGE_PHOTOS_SUCCESS,
      payload: photos,
    });

  } catch (error) {
    console.error("❌ Erreur lors de la récupération des photos:", error);
  }
};
