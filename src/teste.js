export async function returnRentals(req, res) {
    const customerId = req.query.customerId;
    const gameId = req.query.gameId;
  
    try {
      if (customerId) {
        const filteredBycustomerId = await connectionDB.query(
          `SELECT * FROM rentals JOIN customers ON rentals."customerId" = customers.id JOIN games ON rentals."gameId" = games.id WHERE rentals."customerId" = $1;`,
          [customerId]
        );
        return res.send(filteredBycustomerId.rows);
      }
  
      if (gameId) {
        const filteredBygameId = await connectionDB.query(
          `SELECT * FROM rentals JOIN customers ON rentals."customerId" = customers.id JOIN games ON rentals."gameId" = games.id WHERE rentals."gameId" = $1;`,
          [gameId]
        );
        return res.send(filteredBygameId.rows);
      }
  
      const allRentals =
        await connectionDB.query(`SELECT * FROM rentals JOIN customers ON rentals."customerId" = customers.id JOIN games ON rentals."gameId" = games.id
  `);
  
      res.send(allRentals.rows);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }