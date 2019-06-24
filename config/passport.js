// config/passport.js

// load all the things we need
var LocalStrategy = require('passport-local').Strategy;

// load up the user model 
var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');
var dbconfig = require('./database');
var connection = mysql.createConnection(dbconfig.connection);

connection.query('USE ' + dbconfig.database);
// expose this function to our app using module.exports
module.exports = function(passport) {
    var tempDealer;
    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize user out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        console.log(user);
        done(null, user.username);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        connection.query("SELECT * FROM user WHERE username = ? ", [id], function(err, rows) {
            rows[0].dealer = tempDealer;
            done(err, rows[0]);
        });
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use(
        'local-signup',
        new LocalStrategy({
                // by default, local strategy uses username and password, we will override with email
                usernameField: 'username',
                passwordField: 'password',
                passReqToCallback: true // allows us to pass back the entire request to the callback
            },
            function(req, username, password, done) {
                // find a user whose email is the same as the forms email
                // we are checking to see if the user trying to login already exists
                connection.query("SELECT * FROM user WHERE username = ?", [username], function(err, rows) {
                    if (err)
                        return done(err);
                    if (rows.length) {
                        return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
                    } else {
                        // if there is no user with that username
                        // create the user
                        var newUserMysql = {
                            username: username,
                            password: bcrypt.hashSync(password, null, null), // use the generateHash function in our user model
                            level: 1,
                            dealer: 3
                        };

                        var insertQuery = "INSERT INTO user ( username, password, level, dealer ) values (?,?,?,?)";

                        connection.query(insertQuery, [newUserMysql.username, newUserMysql.password, newUserMysql.level, newUserMysql.dealer], function(err, rows) {
                            newUserMysql.id = rows.insertId;

                            return done(null, newUserMysql);
                        });
                    }
                });
            })
    );

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'
    // check if the dealer from the form match to db
    var checkDealer = function(db, form) {
        var leng = db.length;
        if (leng > 1) {
            var deal = new Array();
            deal[0] = db.substr(0, 1);
            if (leng <= 4) {
                deal[1] = db.substr(2, 1);
            } else {
                deal[1] = db.substr(2, 1);
                deal[2] = db.substr(4, 1);
            }
        } else {
            var deal = db;
        }
        console.log(deal);
        var result = 0;
        for (var i = 0; i < deal.length; i++) {
            if (deal[i] === form) {
                return deal[i];
            }
        }
        return result;
    }

    passport.use(
        'local-login',
        new LocalStrategy({
                // by default, local strategy uses username and password, we will override with email
                usernameField: 'username',
                passwordField: 'password',
                passReqToCallback: true // allows us to pass back the entire request to the callback
            },
            function(req, username, password, done) { // callback with email and password from our form
                connection.query("SELECT * FROM user WHERE username = ?", [username], function(err, rows) {
                    if (err)
                        return done(err);
                    if (!rows.length) {
                        return done(null, false, req.flash('loginMessage', 'USERNAME ATAU PASSWORD SALAH.')); // req.flash is the way to set flashdata using connect-flash
                    }

                    if (rows[0].status !== 'AKTIF')
                        return done(null, false, req.flash('loginMessage', 'KAMU TIDAK AKTIF LAGI'));
                    // if the user is found but the password is wrong
                    if (!bcrypt.compareSync(password, rows[0].password))
                        return done(null, false, req.flash('loginMessage', 'USERNAME ATAU PASSWORD SALAH')); // create the loginMessage and save it to session as flashdata
                    // check if its user 
                    if (rows[0].level === 'user') {
                        // check if the dealer from the form match to db
                        var result = checkDealer(rows[0].dealer, req.body.dealer);
                        console.log(result);
                        if (result === 0)
                            return done(null, false, req.flash('loginMessage', 'SALAH MEMILIH DEALER'));
                        else {
                            rows[0].dealer = result;
                            tempDealer = result;
                        }
                    }
                    // all is well, return successful user
                    return done(null, rows[0]);
                });
            })
    );
};