 const mysql = require('mysql');

 var dbconfig = require('./database');
 var conn = mysql.createConnection(dbconfig.connection);

 conn.query('USE ' + dbconfig.database);

 module.exports.getGantung = function(by, search, done) {
     var query = "SELECT penjualan.no_polisi,penjualan.model, pembayaran.id_pembayaran,pembeli.* ,DATE_FORMAT(pembayaran.batas_pelunasan,'%d/%m/%Y') AS bts_pelunasan FROM penjualan INNER JOIN pembayaran ON penjualan.id_pembayaran = pembayaran.id_pembayaran INNER JOIN pembeli ON penjualan.id_pembeli = pembeli.id_pembeli WHERE pembayaran.status = 'GANTUNG' AND ?? LIKE ? ORDER BY pembayaran.batas_pelunasan ASC";
     conn.query(query, [by, '%' + search + '%'], function(err, rows, field) {
         done(err, rows);
     });
 }

 module.exports.getGantungBy = function(search, done) {
     var query = "SELECT *, DATE_FORMAT(pembayaran.batas_pelunasan,'%Y-%m-%d') AS bts_pelunasan FROM pembayaran WHERE id_pembayaran = ?";
     var query1 = "SELECT *, DATE_FORMAT(angsuran.tanggal_angsuran,'%Y-%m-%d') AS tgl_angsuran FROM angsuran WHERE id_pembayaran =?";
     conn.beginTransaction(function(err) {
         if (err) done(err, '');
         conn.query(query, search, function(err, row, field) {
             if (err) {
                 return conn.rollback(function() {
                     done(err, row);
                 });
             }
             conn.query(query1, search, function(err, rows, field) {
                 if (err) {
                     return conn.rollback(function() {
                         done(err, rows);
                     });
                 }
                 conn.commit(function(err) {
                     if (err) {
                         return conn.rollback(function() {
                             done(err, '');
                         });
                     }
                     var data = { pembayaran: row, angsuran: rows };
                     done(1, data);
                 });

             });
         });
     });
 }
 module.exports.bayarAngsuran = function(search, data, done) {
     var query = "INSERT INTO angsuran (id_gantung,id_pembayaran,tanggal_angsuran,stat,deal) VALUES (NULL,?,?,?,?)";
     var query1 = "UPDATE pembayaran SET sisa_bayar = sisa_bayar-(angsuran * " + data.stat + "), tenor = tenor-" + data.stat + " WHERE id_pembayaran = ?";
     if (data.stat === 'LUNAS') {
         console.log("lunas");
         query1 = "UPDATE pembayaran SET sisa_bayar=0,tenor=0,status='LUNAS' WHERE id_pembayaran = ?";
     }

     conn.beginTransaction(function(err) {
         if (err) {
             console.log("a");
             console.log(err);
             done('0');
         }
	//console.log(data);
	if(data.deal === '') data.deal=0;
	var dealll = parseInt(data.deal);
	//console.log(dealll);
         conn.query(query, [search, data.tanggal, data.stat, dealll], function(err, rows, field) {
             if (err) {
                 return conn.rollback(function() {
                     console.log("b");
                     console.log(err);
                     done('0');
                 });
             }
             conn.query(query1, search, function(err, rows, field) {
                 if (err) {
                     return conn.rollback(function() {
                         console.log("c");
                         console.log(err);
                         done('0');
                     });
                 }
                 conn.commit(function(err) {
                     if (err) {
                         return conn.rollback(function() {
                             console.log("d");
                             console.log(err);
                             done('0');
                         });
                     }
                     done('1');
                 });
             });
         });
     })
 }


 module.exports.getPenjualan = function(by, search, done) {
     var query = "SELECT penjualan.*,pembayaran.*, pembeli.* ,DATE_FORMAT(pembayaran.batas_pelunasan,'%d/%m/%Y') AS tgl_pelunasan,DATE_FORMAT(penjualan.tanggal_jual,'%d/%m/%Y') AS tgl_jual FROM penjualan INNER JOIN pembayaran ON penjualan.id_pembayaran = pembayaran.id_pembayaran INNER JOIN pembeli ON penjualan.id_pembeli = pembeli.id_pembeli WHERE penjualan." + by + " = ?";
     if (by === 'all') {
         query = "SELECT penjualan.*,pembayaran.*, pembeli.* ,DATE_FORMAT(pembayaran.batas_pelunasan,'%d/%m/%Y') AS tgl_pelunasan,DATE_FORMAT(penjualan.tanggal_jual,'%d/%m/%Y') AS tgl_jual FROM penjualan INNER JOIN pembayaran ON penjualan.id_pembayaran = pembayaran.id_pembayaran INNER JOIN pembeli ON penjualan.id_pembeli = pembeli.id_pembeli ORDER BY penjualan.model ASC";
     }
     conn.query(query, [search], function(err, rows, field) {
         console.log('query success');
         done(err, rows);
     });
 }

 module.exports.pembelian = function(data, done) {
     var query = "INSERT INTO pembeli (id_pembeli,nik,nama_pembeli,no_telp,alamat) VALUES (NULL,?,?,?,?)";
     var query1 = "INSERT INTO pembayaran (id_pembayaran,status,harga_bayar,sisa_bayar,angsuran,total_bunga,tenor,batas_pelunasan) VALUES (NULL,?,?,?,?,?,?,?)";
     var query2 = "INSERT INTO penjualan (id_penjualan,tanggal_jual,no_mesin,no_polisi,model,harga_terjual,id_pembayaran,id_pembeli,dealer) VALUES (NULL,?,?,?,?,?,?,?,?)";
     var query3 = "UPDATE barang SET status_barang = 'TERJUAL' WHERE no_mesin = ?";
     var query4 = "UPDATE stok SET sisa = sisa - 1 WHERE model = ? AND dealer = ?";
     var beli = data.pembeli;
     var jual = data.penjualan
     conn.beginTransaction(function(err) {
         if (err) {
             done('0');
         }
         var id_pemasok;
         conn.query(query, [beli.nik, beli.fullname, beli.no_telp, beli.alamat], function(err, rows, field) {
             if (err) {
                 console.log('err pembeli');
                 return conn.rollback(function() {
                     done('0');
                 });
             }
             var id_pembeli = rows.insertId;
             conn.query(query1, [jual.status_beli, jual.bayar, jual.total_sisa, jual.angsuran, data.total_bunga, parseInt(jual.tenor), data.batas_pelunasan],
                 function(err, rows, field) {
                     if (err) {
                         console.log('err pembayaran');
                         console.log(err); 
			 return conn.rollback(function() {
                             done('0');
                         });
                     }
                     var id_pembayaran = rows.insertId;
                     conn.query(query2, [data.tanggal, jual.no_mesin, jual.no_polisi, jual.model, jual.total, id_pembayaran, id_pembeli, jual.dealer],
                         function(err, rows, field) {
                             if (err) {
                                 console.log('err penjualan');
				 console.log(err);
                                 return conn.rollback(function() {

                                     done('0');
                                 });
                             }
                             conn.query(query3, [jual.no_mesin], function(err, rows, field) {
                                 if (err) {
                                     console.log('err update status');
				     console.log(err);
                                     return conn.rollback(function() {
                                         done('0');
                                     });
                                 }
                                 conn.query(query4, [jual.model, jual.dealer], function(err, rows, field) {
                                     if (err) {
                                         console.log('err update stok');
					 console.log(err);
                                         return conn.rollback(function() {
                                             done('0');
                                         });
                                     }
                                     conn.commit(function(err) {
                                         if (err) {
					     console.log(err);
                                             return conn.rollback(function() {
                                                 done('0');
                                             });
                                         }
                                         done('1');
                                     });
                                 });

                             });
                         });
                 });
         });
     });
 }

 module.exports.getStatusBarang = function(user, by, search, done) {
     var query;
     if (by === 'all') {
         if (user.level === 'user') {
             console.log("masuk ke user all");
             query = "SELECT * FROM `barang` WHERE dealer = " + user.dealer + " ORDER BY model ASC";
         } else {
             query = "SELECT * FROM `barang` ORDER BY model ASC";
         }
     } else {
         if (user.level === 'user') {
             console.log("masuk ke user by");
             query = "SELECT * FROM barang WHERE " + by + " = ? AND dealer = " + user.dealer;
         } else {
             query = "SELECT * FROM barang WHERE " + by + " = ?";
         }
     }
     conn.query(query, [search], function(err, rows, field) {
         console.log('query success');
         done(err, rows);
     });
 }

 module.exports.getBarangMasuk = function(by, search, done) {
     //  console.log(by);
     var query = "SELECT barang_masuk.* , barang.merk,barang.model,barang.keterangan, pemasok.* ,DATE_FORMAT(barang_masuk.tanggal_masuk,'%d/%m/%Y') AS tgl FROM barang_masuk INNER JOIN barang ON barang_masuk.no_mesin = barang.no_mesin INNER JOIN pemasok ON barang_masuk.id_pemasok = pemasok.id_pemasok WHERE barang." + by + " = ?";
     if (by === 'all') {
         query = "SELECT barang_masuk.* , barang.merk,barang.model,barang.keterangan, pemasok.* ,DATE_FORMAT(barang_masuk.tanggal_masuk,'%d/%m/%Y') AS tgl FROM barang_masuk INNER JOIN barang ON barang_masuk.no_mesin = barang.no_mesin INNER JOIN pemasok ON barang_masuk.id_pemasok = pemasok.id_pemasok ORDER BY barang.merk ASC";
     }
     conn.query(query, [search], function(err, rows, field) {
         console.log('query success');
         done(err, rows);
     });
 }

 module.exports.stok = function(by, cari, done) {
     var query = "SELECT * FROM `stok` WHERE ?? = ?";
     if (by === 'all') {
         query = "SELECT * FROM `stok` ORDER BY dealer ASC";
     }
     conn.query(query, [by, cari], function(err, rows, field) {
         done(err, rows);
     });
 }
 module.exports.getUser = function(search, done) {
     var query = 'SELECT profile.*,user.* FROM `user`INNER JOIN profile ON user.username = profile.username WHERE user.username = ?';
     conn.query(query, [search], function(err, rows, field) {
         if (err) done('error', rows);
         done(err, rows);
     });
 }
 module.exports.getAllUser = function(done) {
     conn.query('SELECT profile.username,profile.nama_lengkap,profile.foto,user.status FROM `user`INNER JOIN profile ON user.username = profile.username', function(err, rows, field) {
         if (err) throw err;
         done(err, rows);
     });
 }

 module.exports.inputData = function(data, done) {
     var queryBarang = "INSERT INTO `barang` (`merk`, `model`, `tahun`, `keterangan`, `no_polisi`, `rekondisi_part`, `rekondisi_stnk`, `grade`, `no_rangka`, `no_mesin`, `harga_jual`, `status_barang`, `dealer`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)";
     var queryPemasok = "INSERT INTO `pemasok` (`id_pemasok`, `nama_pemasok`, `no_telp`, `alamat`, `nik`) VALUES (NULL,?,?,?,?)";
     var queryBarangMasuk = "INSERT INTO `barang_masuk` (`id_masuk`, `no_mesin`, `tanggal_masuk`, `id_pemasok`, `harga_beli`) VALUES (NULL,?,?,?,?)";
     var queryStok = "INSERT INTO stok (dealer, merk, model,sisa) VALUES (?,?,?,1) ON DUPLICATE KEY UPDATE sisa=sisa + 1";
     conn.beginTransaction(function(err) {
         if (err) {
             done(0);
         }
         var id_pemasok;
         conn.query(queryBarang, [data.brand, data.model, data.tahun, data.keterangan, data.no_polisi, data.part, data.stnk, data.grades, data.rangka, data.mesin, data.jual, 'ADA', data.dealer],
             function(err, rows, field) {
                 if (err) {
                     console.log('err barang');
                     return conn.rollback(function() {
                         done(0);
                     });
                 }
                 conn.query(queryPemasok, [data.nama, data.no_telp, data.alamat, data.nik],
                     function(err, rows, field) {
                         if (err) {
                             console.log('err pemasok');
                             return conn.rollback(function() {
                                 done(0);
                             });
                         }
                         id_pemasok = rows.insertId;
                         conn.query(queryBarangMasuk, [data.mesin, data.tanggal, id_pemasok, data.beli],
                             function(err, rows, field) {
                                 if (err) {
                                     console.log('err barang_masuk');
                                     return conn.rollback(function() {
                                         done(0);
                                     });
                                 }
                                 conn.query(queryStok, [data.dealer, data.brand, data.model], function(err, rows, field) {
                                     if (err) {
                                         console.log(err);
                                         return conn.rollback(function() {
                                             done(0);
                                         });
                                     }
                                     conn.commit(function(err) {
                                         if (err) {
                                             return conn.rollback(function() {
                                                 done(0);
                                             });
                                         }
                                         done(1);
                                     });
                                 });
                             });
                     });
             });



     });

 }

 module.exports.editBarang = function(data, done) {
     var query = 'UPDATE `barang` SET `merk`=?, model=?, tahun=?, no_polisi=?, rekondisi_part=?, rekondisi_stnk=?, grade=?, harga_jual=?, status_barang=?, dealer=? WHERE barang.no_mesin = ?';
     var all = data.data;
     conn.query(query, [all.merk, all.model, all.tahun, all.no_polisi, all.part, all.stnk, all.grade, all.harga_jual, all.status, all.dealer, data.no_mesin], function(err, row, field) {
         if (err) {
             done('0');
         }
         done('1');
     })
 }

 module.exports.changePass = function(username, password, result) {
     var query = 'UPDATE user SET password = ? WHERE username = ?';
     conn.query(query, [password, username], function(err, row, field) {
         if (err) {
             console.log(err);
             result(0);
         }
         result(1);
     });
 }

 module.exports.inputUser = function(data, foto, done) {
     var query1 = 'INSERT INTO `user` (`username`,`password`,`level`,`dealer`,`status`) VALUES (?,?,?,?,?)';
     var query2 = 'INSERT INTO `profile` (`username`,`nama_lengkap`,`NIK`,`no_telp`,`alamat`,`foto`) VALUES (?,?,?,?,?,?)';
     conn.beginTransaction(function(err) {
         if (err) done(0);
         conn.query(query1, [data.username, data.password, 'user', data.motor, 'AKTIF'], function(err, rows, field) {
             if (err) {
                 return conn.rollback(function() {
                    	console.log(err);
			 done(0);
                 });
             }
             conn.query(query2, [data.username, data.nama_lengkap, data.nik, data.no_telp, data.alamat, foto], function(err, rows, field) {
                 if (err) {
			console.log(err);
                     return conn.rollback(function() {
                         done(0);
                     });
                 }
                 conn.commit(function(err) {
                     if (err) {
			console.log(err)
                         return conn.rollback(function() {
                             done(0);
                         });
                     }
                     done(1)
                     console.log('success!');
                 });
             })
         })
     });
 }

 module.exports.editUser = function(user, done) {
     var query1 = "UPDATE `user` SET `dealer` = ?,`status` = ? WHERE `user`.`username` = ?";
     var query2 = "UPDATE `profile` SET `nama_lengkap` = ?,`NIK` = ?,`no_telp` = ?,`alamat` = ? WHERE `profile`.`username` = ?";
     conn.beginTransaction(function(err) {
         if (err) done('0');
         conn.query(query1, [user.data.dealer, user.data.stats, user.username], function(err, rows, field) {
             if (err) {
                 return conn.rollback(function() {
                     console.log('query1');
                     done('0');
                 });
             }
             conn.query(query2, [user.data.nama_lengkap, user.data.nik, user.data.no_telp, user.data.alamat, user.data.username], function(err, rows, field) {
                 if (err) {
                     return conn.rollback(function() {
                         console.log('query1');
                         done('0');
                     });
                 }
                 conn.commit(function(err) {
                     if (err) {
                         return conn.rollback(function() {
                             console.log('conn');
                             done('0');
                         });
                     }
                     done('1')
                 });
             })
         })
     });
 }

 module.exports.laporan = function(by, done) {
     var query;
     if (by.berdasarkan === 'penjualan') {
         if (by.req === 'laporan')
             query = "SELECT DATE_FORMAT(penjualan.tanggal_jual,'%d/%m/%Y') AS tgl_jual,penjualan.no_mesin,penjualan.no_polisi,penjualan.model,pembayaran.tenor,penjualan.harga_terjual,pembeli.nama_pembeli FROM penjualan INNER JOIN pembayaran ON penjualan.id_pembayaran = pembayaran.id_pembayaran INNER JOIN pembeli ON penjualan.id_pembeli=pembeli.id_pembeli WHERE (penjualan.tanggal_jual BETWEEN ? AND ?)";
         else
             query = "SELECT COUNT(*) AS jumlah, DATE_FORMAT(penjualan.tanggal_jual,'%m/%d/%Y') AS tgl FROM penjualan WHERE (penjualan.tanggal_jual BETWEEN ? AND ?) GROUP BY tanggal_jual";

     } else if (by.berdasarkan === 'barang_masuk') {
         if (by.req === 'laporan')
             query = "SELECT DATE_FORMAT(barang_masuk.tanggal_masuk,'%d/%m/%Y') AS tgl ,barang.merk,barang.model,barang.no_mesin,barang.no_polisi,barang.no_rangka,barang.tahun,barang_masuk.harga_beli,barang.keterangan FROM barang_masuk INNER JOIN barang ON barang_masuk.no_mesin = barang.no_mesin WHERE (barang_masuk.tanggal_masuk BETWEEN ? AND ? )";
         else
             query = "SELECT COUNT(*) AS jumlah, DATE_FORMAT(barang_masuk.tanggal_masuk,'%m/%d/%Y') AS tgl FROM barang_masuk WHERE (barang_masuk.tanggal_masuk BETWEEN ? AND ?) GROUP BY tanggal_masuk";
     }

     conn.query(query, [by.tgl1, by.tgl2], function(err, rows, field) {
         if (err) {
             console.log(err);
             done('0');
         }
         done(rows);
     });
 }
