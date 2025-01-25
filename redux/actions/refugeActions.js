import { collection, query, where, getDocs } from 'firebase/firestore';
import { FETCH_REFUGES_SUCCESS, FETCH_REFUGES_ERROR } from '../constants';
import { db } from '../database/firebaseConfig';

export const fetchAccessibleRefuges = (userLocation) => async (dispatch) => {
  try {
    const q = query(collection(db, 'refuges'), where('accessible_pmr', '==', true));
    const querySnapshot = await getDocs(q);

    const refuges = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Calcul des distances entre la position et chaque refuge
    const calculateDistanceInMeters = (lat1, lon1, lat2, lon2) => {
      const R = 6371000; // Rayon de la Terre en mètres
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

    const refugesWithDistances = refuges.map((refuge) => {
      const distance = calculateDistanceInMeters(
        userLocation.lat,
        userLocation.lng,
        refuge.location.lat,
        refuge.location.lng
      );
      return {
        ...refuge,
        distance, // Distance en mètres
        distanceText: `${(distance / 1000).toFixed(2)} km`, // Formater en km
      };
    });

    // Filtrer les refuges dans un rayon de 5 km
    const refugesInRadius = refugesWithDistances.filter((refuge) => refuge.distance <= 5000);

    // Trier les refuges par distance croissante et limiter à 20
    const top20Refuges = refugesInRadius.sort((a, b) => a.distance - b.distance).slice(0, 50);

    dispatch({
      type: FETCH_REFUGES_SUCCESS,
      payload: top20Refuges,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des refuges:', error);
    dispatch({
      type: FETCH_REFUGES_ERROR,
      payload: error.message,
    });
  }
};
