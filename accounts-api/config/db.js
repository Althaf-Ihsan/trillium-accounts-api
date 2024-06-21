
const mysql=require('mysql2')
const dotenv=require("dotenv")
dotenv.config();
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB
};

const pool = mysql.createPool(dbConfig);
pool.getConnection((err, connection) => {
  if (err) {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.error('Database connection was closed.');
    }
    if (err.code === 'ER_CON_COUNT_ERROR') {
      console.error('Database has too many connections.');
    }
    if (err.code === 'ECONNREFUSED') {
      console.error('Database connection was refused.');
    }
  }
  if (connection) {
    connection.release();
    console.log('Database connected successfully!');
  }
});

 const executeQuery=  (query,parameters)=>{
  return new Promise((resolve, reject) => {
    pool.query(query, parameters, (error, results) => {
        if (error) {
            console.error("Database query error:", error);
            reject(error);
        } else {
            resolve(results);
        }
    });
});
     
}
module.exports={ executeQuery};
