const cron = require('node-cron');

const pg = require(__dirname + '/pg.js');
 
// Hourly jobs
cron.schedule('0 * * * *', () => {
  console.log('Cleaning up inactive users...');
  pg.query('SELECT cleanup_inactive() AS num_rows')
    .then(result => {
      console.log('Cleaned up ' + result[0].num_rows + ' inactive users.');
    })
    .catch(err => console.error('Error', err));

    console.log('Cleaning up unused password tokens...');
    pg.query('SELECT cleanup_password_tokens() AS num_rows')
      .then(result => {
        console.log('Cleaned up ' + result[0].num_rows + ' password tokens.');
      })
      .catch(err => console.error('Error', err));
});