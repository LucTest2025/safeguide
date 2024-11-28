const fs = require('fs');
const xml2js = require('xml2js');

const parser = new xml2js.Parser();

// Liste des types accessibles pour PMR
const PMR_TYPES = ['Rue', 'Place', 'Parking', 'Route', 'Carrefour', 'Rond-point', 'Terre-plein', 'Placette'];

// Lire le fichier KML
fs.readFile('sites_refuge.kml', (err, data) => {
  if (err) {
    console.error('Erreur lors de la lecture du fichier KML:', err);
    return;
  }

  parser.parseString(data, (err, result) => {
    if (err) {
      console.error('Erreur lors de la conversion du fichier KML:', err);
      return;
    }

    // Extraire les données des refuges
    const placemarks = result.kml.Document[0].Folder[0].Placemark;

    const refuges = placemarks.map((placemark) => {
      const details = placemark.ExtendedData[0].SchemaData[0].SimpleData.reduce(
        (acc, item) => {
          acc[item.$.name] = item._;
          return acc;
        },
        {}
      );
      const coordinates = placemark.Point[0].coordinates[0].trim().split(',');

      // Déterminer si le refuge est accessible pour les PMR
      const isAccessible = PMR_TYPES.includes(details.Type);

      return {
        nom: details.Nom_SR,
        type: details.Type,
        commune: details.Commune,
        altitude: parseInt(details.Alt_moy_m, 10),
        location: {
          lat: parseFloat(coordinates[1]),
          lng: parseFloat(coordinates[0]),
        },
        accessible_pmr: isAccessible, // Nouveau champ
      };
    });

    // Écrire les données JSON dans un fichier
    fs.writeFile('refuges.json', JSON.stringify(refuges, null, 2), (err) => {
      if (err) {
        console.error('Erreur lors de l\'écriture du fichier JSON:', err);
        return;
      }
      console.log('Conversion réussie ! Les données sont dans refuges.json');
    });
  });
});
