const pg = require(__dirname + '/../api/pg.js');
const utils = require(__dirname + '/../api/utils.js');

const REQUEST_LIFE = (60 * 5);

class Game {
  constructor(row) {
    this.id = row.id;
    this.player_1_id;
    this.player_2_id;
  }
}

exports.request = (player1ID, player2ID, settings) => {
  let expiryTime = utils.now() + REQUEST_LIFE;
  return pg.query(
    `INSERT INTO game_requests (
      player_1_id, player_2_id, settings, expiry_time
    )
    VALUES ($1::bigint, $2::bigint, $3::json, $4::bigint)
    ON CONFLICT (player_1_id, player_2_id) DO
    UPDATE SET
      settings = $3::json,
      expiry_time = $4::bigint`,
    [player1ID, player2ID, settings, expiryTime],
  );
}

