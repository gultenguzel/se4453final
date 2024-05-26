
var express = require('express');
var router = express.Router();
const { Pool } = require('pg');
const { DefaultAzureCredential } = require("@azure/identity");
const { SecretClient } = require("@azure/keyvault-secrets");

async function getSecret(secretName) {
  const credential = new DefaultAzureCredential();
  const keyVaultName = "final-kvt";
  if (!keyVaultName) throw new Error("KEY_VAULT_NAME is empty");
  const url = "https://" + keyVaultName + ".vault.azure.net";
  const client = new SecretClient(url, credential);
  const secret = await client.getSecret(secretName);
  return secret.value;
}

async function getDBConfig() {
  const dbConfig = {
    user: await getSecret("username"),
    host: await getSecret("host"),
    database: "postgres",
    password: await getSecret("password"),
    port: 5432,
    ssl: true
  };
  return dbConfig;
}


router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/hello', async function (req, res, next) {
  try {
    const dbConf = await getDBConfig();
    console.log(dbConf);

    try {
      const pool = new Pool(dbConf);

      const result = await pool.query('SELECT * FROM users');

      if (result.rows.length > 0) {
        res.render('hello', { users: result.rows });
      } else {
        res.status(404).send('Kullanıcı bulunamadı');
      }
    } catch (poolErr) {
      throw poolErr; // İçteki hata dışarıya atılır
    }
  } catch (err) {
    res.status(500).send('Sunucu hatası');

    console.error('PostgreSQL bağlantı hatası:', err);
  }
});


module.exports = router;