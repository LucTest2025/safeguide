import * as functions from "firebase-functions/v1";
import * as admin from "firebase-admin";

admin.initializeApp();

export const notifyRefugeUpdate = functions.firestore
  .document("refuges/{refugeId}")
  .onUpdate(
    (
      change: functions.Change<functions.firestore.DocumentSnapshot>,
      context: functions.EventContext // eslint-disable-line @typescript-eslint/no-unused-vars
    ) => {
      const beforeData = change.before.data();
      const afterData = change.after.data();

      // Vérifier si une mise à jour a eu lieu
      if (
        beforeData?.status !== afterData?.status ||
        beforeData?.name !== afterData?.name
      ) {
        const message = {
          notification: {
            title: "Mise à jour de refuge",
            body: `Le refuge ${afterData?.name} est maintenant ` +
                  `${afterData?.status}.`,
          },
          topic: "refuges",
        };

        return admin
          .messaging()
          .send(message)
          .then((response) => {
            console.log("Notification envoyée :", response);
            return null;
          })
          .catch((error) => {
            console.error("Erreur lors de l'envoi :", error);
            return null;
          });
      }
      return null;
    }
  );
