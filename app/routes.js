var db = require('../config/db.js');
var bcrypt = require('bcrypt-nodejs');
// app/routes.js
module.exports = function(app, passport) {

    // ===================================== 
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function(req, res) {
        res.render('login.ejs', { message: req.flash('loginMessage') });
    });

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('login.ejs', { message: req.flash('loginMessage') });
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
            successRedirect: '/dashboard', // redirect to the secure profile section
            failureRedirect: '/login', // redirect back to the signup page if there is an error
            failureFlash: true // allow flash messages
        }),
        function(req, res) {
            console.log("hello");

            if (req.body.remember) {
                req.session.cookie.maxAge = 1000 * 60 * 3;
            } else {
                req.session.cookie.expires = false;
            }
            res.redirect('/');
        });

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/login', // redirect to the secure profile section
        failureRedirect: '/signup', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    // =====================================
    // CONTENT SECTION =========================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    function isEmptyy(obj, byy) {
        var by = byy;
        if (obj.hasOwnProperty('berdasarkan') === true) {
            by = obj.berdasarkan;
        }
        return by;
    }

    function isEmpty(obj) {
        var by;
        if (obj.hasOwnProperty('berdasarkan') === true) {
            by = obj.berdasarkan;
        } else {
            by = 'all';
        }
        return by;
    }

    app.route('/dashboard')
        .get(isLoggedIn, function(req, res) {
            // console.log(req.user);
            if (req.user.level === 'user') {
                res.redirect('/penjualan_gantung');
            } else {
                res.render('dashboard.ejs', {
                    user: req.user
                });
            }
        })
        .post(isLoggedIn, function(req, res) {
            // console.log(req.body);
            db.laporan(req.body, function(result) {
                var data = JSON.stringify(result);
                res.json(data);
            });
        })

    app.route('/akun')
        .get(isLoggedIn, function(req, res) {
            res.render('akun.ejs', {
                user: req.user,
                result: 2
            });
        })
        .post(isLoggedIn, function(req, res) {
            console.log(req.user);
            var check = bcrypt.compareSync(req.body.pwlama, req.user.password);
            if (!check) {
                console.log("password tidak sama");
                res.render('akun.ejs', {
                    user: req.user,
                    result: 0
                });
            } else {
                req.body.pwbaru1 = bcrypt.hashSync(req.body.pwbaru1, null, null);
                db.changePass(req.user.username, req.body.pwbaru1, function(result) {
                    // console.log(result);
                    res.render('akun.ejs', {
                        user: req.user,
                        result: result
                    });
                });
            }
        })


    app.get('/penjualan', isLoggedIn, function(req, res) {
        if (req.user.level === 'user') res.redirect('404.html');
        db.getPenjualan(isEmpty(req.query), req.query.cari, function(err, data) {
            if (err) console.log(err);
            // console.log(data);
            var modal = JSON.stringify(data);
            res.render('penjualan.ejs', {
                user: req.user,
                status: true,
                data: data,
                modal: modal
            });
        });
    });

    app.get('/penjualan_gantung', isLoggedIn, function(req, res) {
        var search = '';
        if (req.query.hasOwnProperty('cari')) {
            search = req.query.cari;
        }
        db.getGantung(isEmptyy(req.query, 'pembeli.nama_pembeli'), search, function(err, rows) {
            if (err) console.log(err);
            // console.log(rows);
            res.render('penjualan_gantung.ejs', {
                user: req.user,
                data: rows
            });
        });
    });

    app.route('/penjualan_gantung/:id_pembayaran')
        .get(isLoggedIn, function(req, res) {
            db.getGantungBy(req.params.id_pembayaran, function(err, rows) {
                if (err) console.log(err);
                //console.log(rows);
		var rawData = JSON.stringify(rows);
                res.render('gantung.ejs', {
                    user: req.user,
                    data: rows,
                    rawData: rawData
                });
            })
        })
        .post(isLoggedIn, function(req, res) {
            db.bayarAngsuran(req.params.id_pembayaran, req.body, function(result) {
                // console.log(result);
                res.json({ "hasil": result })
            });
        })

    app.route('/pembelian/:no_mesin')
        .get(isLoggedIn, function(req, res) {
            db.getStatusBarang(req.user, 'no_mesin', req.params.no_mesin, function(err, data) {
                if (err) console.log('gagal fetch data');
                res.render('pembelian.ejs', {
                    user: req.user,
                    data: data
                });
            });
        })
        .post(isLoggedIn, function(req, res) {
            console.log(req.body);
            db.pembelian(req.body, function(result) {
                // console.log(result);
                res.json({ "hasil": result })
            });
        })

    app.get('/barang_masuk', isLoggedIn, function(req, res) {
        if (req.user.level === 'user') res.redirect('404.html');
        db.getBarangMasuk(isEmpty(req.query), req.query.cari, function(err, data) {
            if (err) throw err;
            // console.log(data);
            res.render('barang_masuk.ejs', {
                user: req.user,
                status: true,
                data: data
            });
        });
    });

    app.route('/input_data')
        .get(isLoggedIn, function(req, res) {
            res.render('input_data.ejs', {
                result: 2,
                user: req.user
            });
        })
        .post(isLoggedIn, function(req, res) {
            // console.log(req.body);
            db.inputData(req.body, function(result) {
                // console.log(result);
                res.render('input_data.ejs', {
                    result: result,
                    user: req.user
                });
            });
        })
        .put(isLoggedIn, function(req, res) {
            // console.log(req.body);
            db.editBarang(req.body, function(result) {
                // console.log(result);
                res.json({ "hasil": result });
            });
        })


    app.get('/status_barang', isLoggedIn, function(req, res) {
        db.getStatusBarang(req.user, isEmpty(req.query), req.query.cari, function(err, data) {
            // console.log(data);
            var modal = JSON.stringify(data);
            res.render('status_barang.ejs', {
                user: req.user,
                status: true,
                data: data,
                modal: modal
            });
        });
    });

    app.get('/stok', isLoggedIn, function(req, res) {
        if (req.user.level === 'user') res.redirect('404.html');
        db.stok(isEmpty(req.query), req.query.cari, function(err, rows) {
            // console.log(rows);
            res.render('stok.ejs', {
                user: req.user,
                data: rows
            });
        });
    });
    app.route('/user')
        .get(isLoggedIn, function(req, res) {
            if (req.user.level === 'user') res.redirect('404.html');
            db.getAllUser(function(err, rows) {
                // console.log(rows);
                res.render('user.ejs', {
                    user: req.user,
                    rows: rows,
                    result: 2
                });
            });
        })
        .post(isLoggedIn, function(req, res) {
            // console.log(req.body);
            var photoName = req.body.username;
            var file = true;
            if (!req.files.hasOwnProperty('foto')) {
                console.log('ga ada file');
                photoName = 'no_photo.png';
                file = false;
            }
            var motor = req.body.motor;
            var tempMotor = '';
            for (var i = 0; i < motor.length; i++) {
                tempMotor = tempMotor + req.body.motor[i] + ",";
            }
            req.body.motor = tempMotor;
            req.body.password = bcrypt.hashSync(req.body.password, null, null);
            console.log(req.body);

            db.inputUser(req.body, photoName, function(result) {
                let foto = req.files.foto;
                if (!result) {
                    res.redirect('/user');
                    res.end();
                }
                if (result === 1 && file === true) {
                    foto.mv('views/assets/img/' + photoName, function(err) {
                        if (err) {
                            return res.status(500).send(err);
                            res.render('user.ejs', {
                                user: req.user,
                                result: 3
                            });
                            res.end();
                        }
                    });
                }
                res.render('user.ejs', {
                    user: req.user,
                    result: result
                });
            });
        })
        .put(isLoggedIn, function(req, res) {
            // console.log(req.body);
            db.editUser(req.body, function(result) {
                // console.log(result);
                res.json({ "result": result });
            });
        })
    app.get('/user/:username', isLoggedIn, function(req, res) {
        if (req.user.level === 'user') res.redirect('404.html');
        var username = req.params.username;
        db.getUser(username, function(err, rows) {
            // console.log(rows);
            // var data = JSON.stringify(rows);
            res.json(rows);
        });
    });
    /// ====================
    /// USER
    /// ====================



    // ====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
};

// route middleware to make sure
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}
