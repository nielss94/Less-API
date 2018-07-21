const config = {
    host     : process.env.DBHOST || 'eu-cdbr-west-02.cleardb.net',
    user     : process.env.DBUSER || 'b8c0a9bf724fd6',
    password : process.env.DBPASS || '51072b09',
    database : process.env.DBNAME || 'heroku_f119942171d70eb'
}

module.exports = config;