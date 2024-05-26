const { Pool } = require('pg');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, async () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor`);
  try {
    const dbConf = await getDBConfig()
    const pool = new Pool(dbConf);
    const result = await pool.query('SELECT * FROM users', (err, res) => {
      if (err) {
        console.error('Bağlantı hatası:', err.stack);
      } else {
        console.log('Bağlantı başarılı:', res.rows);
      }
    });
    console.log(result);

  } catch { }

});

module.exports = app;
