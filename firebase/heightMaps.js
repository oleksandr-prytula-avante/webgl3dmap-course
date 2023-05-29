const { v4 } = require('uuid');
const { db }  = require('./db');

const heightMapsRef = db.ref('heightmaps');

const HeightMapRoute = '/heightmap';
const HeightMapByIdRoute = `${HeightMapRoute}/:id`;

function useHeightMaps(app) {
  app.get(HeightMapRoute, function(_, res) {
    const heightmaps = heightMapsRef.get();

    res.status(200).send(heightmaps);
  })

  app.post(HeightMapRoute, function(req, res) {
    const heightMap = req.body.heightMap;
    const id = v4();

    heightMapsRef.set({ [id]: heightMap });
    res.sendStatus(201);
  });

  app.delete(HeightMapByIdRoute, function(req, res) {
    const id = req.params.id;

    heightMapsRef.child(id).remove();
    res.sendStatus(204);
  });
}

module.exports = { useHeightMaps };
