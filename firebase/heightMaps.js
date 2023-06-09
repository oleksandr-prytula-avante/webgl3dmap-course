const { v4 } = require('uuid');
const { db }  = require('./db');

const heightMapsRef = db.ref('heightmaps');

const HeightMapRoute = '/heightmap';
const HeightMapByIdRoute = `${HeightMapRoute}/:id`;

function useHeightMaps(app) {
  app.get(HeightMapRoute, async function(_, res) {
    const heightmaps = await heightMapsRef.get();

    res.status(200).send(heightmaps);
  })

  app.post(HeightMapRoute, function(req, res) {
    const id = v4();
    const { colorImage, greyscaleImage } = req.body;
    const heightMap = {
      colorImage,
      greyscaleImage,
      createdAt: (new Date()).toISOString(),
    };

    heightMapsRef.child(id).set(heightMap);
    res.sendStatus(201);
  });

  app.delete(HeightMapByIdRoute, function(req, res) {
    const id = req.params.id;

    heightMapsRef.child(id).remove();
    res.sendStatus(204);
  });
}

module.exports = { useHeightMaps };
