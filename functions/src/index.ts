import * as functions from "firebase-functions/v1";
import * as admin from "firebase-admin";

admin.initializeApp();

// Fonction de notification pour les mises à jour de refuges
export const notifyRefugeUpdate = functions.firestore
  .document("refuges/{refugeId}")
  .onUpdate(
    (
      change: functions.Change<functions.firestore.DocumentSnapshot>
    ) => {
      const beforeData = change.before.data();
      const afterData = change.after.data();

      // Vérifier si les données existent
      if (!beforeData || !afterData) {
        console.error("Données manquantes pour la mise à jour");
        return null;
      }

      console.log("Données avant :", beforeData);
      console.log("Données après :", afterData);

      // Vérifier si une mise à jour a eu lieu sur des champs pertinents
      const hasChanged =
        beforeData.nom !== afterData.nom ||
        beforeData.type !== afterData.type ||
        beforeData.accessible_pmr !== afterData.accessible_pmr ||
        beforeData.altitude !== afterData.altitude ||
        beforeData.commune !== afterData.commune ||
        beforeData.location?.lat !== afterData.location?.lat ||
        beforeData.location?.lng !== afterData.location?.lng;

      console.log("Changements détectés :", hasChanged);

      if (hasChanged) {
        // Construire le message de notification
        const message = {
          notification: {
            title: "Mise à jour de refuge",
            body: `Le refuge ${afterData.nom} (${afterData.type}) situé à ${
              afterData.commune
            } a été mis à jour. ${
              afterData.accessible_pmr ?
                "Ce site est accessible aux PMR." :
                "Ce site n'est pas accessible aux PMR."
            }`,
          },
          topic: "refuges",
        };

        console.log("Message construit :", JSON.stringify(message, null, 2));

        // Envoyer la notification via Firebase Messaging
        return admin
          .messaging()
          .send(message)
          .then((response) => {
            console.log("Notification envoyée :", response);
            return null;
          })
          .catch((error) => {
            console.error("Erreur lors de l'envoi de la notification :", error);
            return null;
          });
      }

      console.log("Aucun changement pertinent détecté.");
      return null;
    }
  );
