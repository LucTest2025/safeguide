const db = require('./firebase-admin');
const refuges = require('./refuges.json');

const uploadRefuges = async () => {
  const batch = db.batch();

  refuges.forEach((refuge) => {
    const refugeRef = db.collection('refuges').doc(); // Génère un ID aléatoire
    batch.set(refugeRef, refuge);
  });

  try {
    await batch.commit();
    console.log('Les refuges ont été importés avec succès, avec les informations PMR !');
  } catch (err) {
    console.error('Erreur lors de l\'importation des refuges :', err);
  }
};

uploadRefuges();
