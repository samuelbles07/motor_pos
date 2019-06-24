-- phpMyAdmin SQL Dump
-- version 4.5.2
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: 20 Apr 2017 pada 22.21
-- Versi Server: 10.1.13-MariaDB
-- PHP Version: 5.6.20

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `zaky_motor`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `angsuran`
--

CREATE TABLE `angsuran` (
  `id_gantung` int(20) NOT NULL,
  `id_pembayaran` int(20) NOT NULL,
  `tanggal_angsuran` date NOT NULL,
  `stat` varchar(6) NOT NULL,
  `deal` int(2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data untuk tabel `angsuran`
--

INSERT INTO `angsuran` (`id_gantung`, `id_pembayaran`, `tanggal_angsuran`, `stat`, `deal`) VALUES
(1, 3, '2017-04-09', 'LUNAS', 2),
(2, 2, '2017-04-09', '1', 2),
(3, 2, '2017-04-09', '1', 3),
(4, 2, '2017-04-09', '2', 3),
(5, 2, '2017-04-09', 'LUNAS', 3),
(6, 4, '2017-04-19', '1', 0),
(7, 4, '2017-04-19', '3', 0),
(8, 6, '2017-04-20', '2', 0),
(9, 4, '2017-04-20', 'LUNAS', 2),
(10, 7, '2017-04-20', '1', 2),
(11, 7, '2017-04-20', '2', 2),
(12, 7, '2017-04-20', '1', 2);

-- --------------------------------------------------------

--
-- Struktur dari tabel `barang`
--

CREATE TABLE `barang` (
  `merk` varchar(30) NOT NULL,
  `model` varchar(50) NOT NULL,
  `tahun` int(4) NOT NULL,
  `keterangan` text NOT NULL,
  `no_polisi` varchar(10) NOT NULL,
  `rekondisi_part` int(20) NOT NULL,
  `rekondisi_stnk` int(20) NOT NULL,
  `grade` varchar(2) NOT NULL,
  `no_rangka` varchar(30) NOT NULL,
  `no_mesin` varchar(30) NOT NULL,
  `harga_jual` int(20) NOT NULL,
  `status_barang` varchar(8) NOT NULL,
  `dealer` int(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data untuk tabel `barang`
--

INSERT INTO `barang` (`merk`, `model`, `tahun`, `keterangan`, `no_polisi`, `rekondisi_part`, `rekondisi_stnk`, `grade`, `no_rangka`, `no_mesin`, `harga_jual`, `status_barang`, `dealer`) VALUES
('HONDA', 'FU', 2013, 'KFFHDSLAH', 'BK2001KL', 0, 0, 'A', '82YUTEHFWJ', '28YTFWHDKJ', 21000000, 'TERJUAL', 2),
('SUZUKI', 'FU', 2014, 'ASAL AJA', 'BK9009BC', 2000000, 1000000, 'A', '592UIHSHGSH9', '2YHRTFKWFGBW', 16000000, 'TERJUAL', 1),
('YAMAHA', 'VARIO', 2010, 'FHSKFSH', 'FH3847AH', 0, 0, 'B', '89FHSFHS', '98YFHIUFS', 22000000, 'TERJUAL', 2),
('KAWASAKI', 'NINJA RR 250 MONOABS', 2014, '-', 'BK3722RAP', 4837775, 318500, 'B', 'MH4BX250BEJP00074', 'BX250AEA02358', 25000000, 'TERJUAL', 3),
('SUZUKI', 'SATRIA FU 150 MFA', 2016, '-', 'BK3157AGR', 1149651, 44389, 'A', 'MH8DL11AZGJ138480', 'CGA1ID138346', 17000000, 'TERJUAL', 1),
('HONDA', 'NEW REVO FI SW', 2012, '-', 'BK3505AGC', 1454882, 230312, 'B', 'MH1JBK212FK088752', 'JBK2E1088441', 8800000, 'TERJUAL', 2),
('DUCATI', 'DIAVEL', 2014, '-', 'B2019FSJ', 4000000, 500000, 'A', '2579UIJKFDGSH', 'YTHGIWJNG', 33000000, 'TERJUAL', 1);

-- --------------------------------------------------------

--
-- Struktur dari tabel `barang_masuk`
--

CREATE TABLE `barang_masuk` (
  `id_masuk` int(20) NOT NULL,
  `no_mesin` varchar(30) NOT NULL,
  `tanggal_masuk` date NOT NULL,
  `id_pemasok` int(20) NOT NULL,
  `harga_beli` int(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data untuk tabel `barang_masuk`
--

INSERT INTO `barang_masuk` (`id_masuk`, `no_mesin`, `tanggal_masuk`, `id_pemasok`, `harga_beli`) VALUES
(18, 'CGA1ID138346', '2017-04-09', 18, 16300000),
(19, 'BX250AEA02358', '2017-04-09', 19, 23100000),
(20, 'JBK2E1088441', '2017-04-09', 20, 7900000),
(21, 'YTHGIWJNG', '2017-04-10', 21, 30000000),
(22, '2YHRTFKWFGBW', '2017-04-19', 22, 15000000),
(23, '98YFHIUFS', '2017-04-19', 23, 20000000),
(24, '28YTFWHDKJ', '2017-04-19', 24, 20000000);

-- --------------------------------------------------------

--
-- Struktur dari tabel `pemasok`
--

CREATE TABLE `pemasok` (
  `id_pemasok` int(20) NOT NULL,
  `nama_pemasok` varchar(50) NOT NULL,
  `no_telp` varchar(13) NOT NULL,
  `alamat` text NOT NULL,
  `nik` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data untuk tabel `pemasok`
--

INSERT INTO `pemasok` (`id_pemasok`, `nama_pemasok`, `no_telp`, `alamat`, `nik`) VALUES
(18, 'ROFIKA', '08525838573', 'JLN. MERDEKA BARU NO 100A', '12749049193'),
(19, 'DEDI IRWANSYAH', '08984301849', 'JLN. MONGONSIDI UJUNG', '127498349741'),
(20, 'SUBUR SARWONO', '081951039301', 'JLN. SUMARSONO NO 139', '1394179401'),
(21, 'LEASING', '061937833', 'JLNN. KAPTEN MUSLIM', ''),
(22, 'LEASING', '08127643835', 'JLN. PANDU', '0'),
(23, 'ASDFS', '89151569', 'JLN.FDSFHS', '19847139'),
(24, 'FDKLSAJF', '8905095137', 'FHDSLAFH', '0');

-- --------------------------------------------------------

--
-- Struktur dari tabel `pembayaran`
--

CREATE TABLE `pembayaran` (
  `id_pembayaran` int(20) NOT NULL,
  `status` varchar(8) NOT NULL,
  `harga_bayar` varchar(20) NOT NULL,
  `sisa_bayar` varchar(20) DEFAULT NULL,
  `angsuran` varchar(20) DEFAULT NULL,
  `total_bunga` varchar(20) DEFAULT NULL,
  `tenor` int(3) DEFAULT NULL,
  `batas_pelunasan` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data untuk tabel `pembayaran`
--

INSERT INTO `pembayaran` (`id_pembayaran`, `status`, `harga_bayar`, `sisa_bayar`, `angsuran`, `total_bunga`, `tenor`, `batas_pelunasan`) VALUES
(1, 'LUNAS', '8800000', '0', '', NULL, 0, '0000-00-00'),
(2, 'LUNAS', '15000000', '0', '1966667', '1800000', 0, '2017-10-09'),
(3, 'LUNAS', '13000000', '0', '2040000', '80000', 0, '2017-06-09'),
(4, 'LUNAS', '10000000', '0', '1360000', '2160000', 0, '2017-10-19'),
(5, 'LUNAS', '22000000', '0', '', NULL, 0, '0000-00-00'),
(6, 'GANTUNG', '10000000', '4326666', '4326667', '1980000', 1, '2017-07-19'),
(7, 'GANTUNG', '10000000', '26373332', '3296667', '16560000', 8, '2018-04-20');

-- --------------------------------------------------------

--
-- Struktur dari tabel `pembeli`
--

CREATE TABLE `pembeli` (
  `id_pembeli` int(20) NOT NULL,
  `nik` varchar(20) NOT NULL,
  `nama_pembeli` varchar(50) NOT NULL,
  `no_telp` varchar(13) NOT NULL,
  `alamat` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data untuk tabel `pembeli`
--

INSERT INTO `pembeli` (`id_pembeli`, `nik`, `nama_pembeli`, `no_telp`, `alamat`) VALUES
(1, '1274098340', 'WAHYU LOUIS', '087439431920', 'JLN. SETIA BUDI NO 100'),
(2, '1274309970', 'DICKY JAMES', '08124896532', 'JLN. SUSUK 2'),
(3, '572652878', 'ARESPATION', '08349493843', 'JLN HELVETIA UJUNG NO 90'),
(4, '75195169', 'NTAHH', '0812483749', 'JLN.FDSFHSKF'),
(5, '4719', 'FDKJSHFKS', '9872957', 'HFDSLKHLKFA'),
(6, '1239809809', 'BESSS', '08126413749', 'JLN. MERDEKA BARAT NO 100'),
(7, '127094380', 'BLESYOOO', '081247834928', 'JLN. STELLA MEDAN RAYA');

-- --------------------------------------------------------

--
-- Struktur dari tabel `penjualan`
--

CREATE TABLE `penjualan` (
  `id_penjualan` int(20) NOT NULL,
  `tanggal_jual` date NOT NULL,
  `no_mesin` varchar(20) NOT NULL,
  `no_polisi` varchar(10) NOT NULL,
  `model` varchar(50) NOT NULL,
  `harga_terjual` int(20) NOT NULL,
  `id_pembayaran` int(20) NOT NULL,
  `id_pembeli` int(20) NOT NULL,
  `dealer` int(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data untuk tabel `penjualan`
--

INSERT INTO `penjualan` (`id_penjualan`, `tanggal_jual`, `no_mesin`, `no_polisi`, `model`, `harga_terjual`, `id_pembayaran`, `id_pembeli`, `dealer`) VALUES
(1, '2017-04-09', 'JBK2E1088441', 'BK3505AGC', 'NEW REVO FI SW', 8800000, 1, 1, 2),
(2, '2017-04-09', 'BX250AEA02358', 'BK3722RAP', 'NINJA RR 250 MONOABS', 26800000, 2, 2, 3),
(3, '2017-04-09', 'CGA1ID138346', 'BK3157AGR', 'SATRIA FU 150 MFA', 17080000, 3, 3, 1),
(4, '2017-04-19', '2YHRTFKWFGBW', 'BK9009BC', 'FU', 18160000, 4, 4, 1),
(5, '2017-04-19', '98YFHIUFS', 'FH3847AH', 'VARIO', 22000000, 5, 5, 2),
(6, '2017-04-19', '28YTFWHDKJ', 'BK2001KL', 'FU', 22980000, 6, 6, 2),
(7, '2017-04-20', 'YTHGIWJNG', 'B2019FSJ', 'DIAVEL', 49560000, 7, 7, 1);

-- --------------------------------------------------------

--
-- Struktur dari tabel `profile`
--

CREATE TABLE `profile` (
  `username` varchar(30) NOT NULL,
  `nama_lengkap` varchar(50) NOT NULL,
  `NIK` varchar(20) NOT NULL,
  `no_telp` varchar(13) NOT NULL,
  `alamat` text NOT NULL,
  `foto` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data untuk tabel `profile`
--

INSERT INTO `profile` (`username`, `nama_lengkap`, `NIK`, `no_telp`, `alamat`, `foto`) VALUES
('ekiarmanda', 'EKI ARMANDA', '12700941483', '081274582943', 'JLN. ABDUL HAKIM NO 10', 'ekiarmanda');

-- --------------------------------------------------------

--
-- Struktur dari tabel `stok`
--

CREATE TABLE `stok` (
  `dealer` int(4) NOT NULL,
  `merk` varchar(30) NOT NULL,
  `model` varchar(50) NOT NULL,
  `sisa` int(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data untuk tabel `stok`
--

INSERT INTO `stok` (`dealer`, `merk`, `model`, `sisa`) VALUES
(1, 'DUCATI', 'DIAVEL', 0),
(1, 'SUZUKI', 'FU', 0),
(1, 'SUZUKI', 'SATRIA FU 150 MFA', 0),
(2, 'HONDA', 'FU', 0),
(2, 'HONDA', 'NEW REVO FI SW', 0),
(2, 'YAMAHA', 'VARIO', 0),
(3, 'KAWASAKI', 'NINJA RR 250 MONOABS', 0);

-- --------------------------------------------------------

--
-- Struktur dari tabel `user`
--

CREATE TABLE `user` (
  `username` varchar(30) NOT NULL,
  `password` char(60) NOT NULL,
  `level` varchar(10) DEFAULT NULL,
  `dealer` varchar(4) DEFAULT NULL,
  `status` varchar(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data untuk tabel `user`
--

INSERT INTO `user` (`username`, `password`, `level`, `dealer`, `status`) VALUES
('admin', '$2a$10$gKNrkhefWTPi2uO0ZnFmKej0QkL6SADFG6A4640kCDSB11l1bP/.e', 'admin', '0', 'AKTIF'),
('ekiarmanda', '$2a$10$41aGZBHKpLO58AiMpLg8f.kF6hZ4McIE2mQM1k.p2o.hnfuHdCm.a', 'user', '2,3,', 'AKTIF');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `angsuran`
--
ALTER TABLE `angsuran`
  ADD PRIMARY KEY (`id_gantung`),
  ADD KEY `id_pembayaran` (`id_pembayaran`);

--
-- Indexes for table `barang`
--
ALTER TABLE `barang`
  ADD PRIMARY KEY (`no_mesin`),
  ADD UNIQUE KEY `no_rangka` (`no_rangka`);

--
-- Indexes for table `barang_masuk`
--
ALTER TABLE `barang_masuk`
  ADD PRIMARY KEY (`id_masuk`),
  ADD KEY `no_mesin` (`no_mesin`),
  ADD KEY `id_pemasok` (`id_pemasok`);

--
-- Indexes for table `pemasok`
--
ALTER TABLE `pemasok`
  ADD PRIMARY KEY (`id_pemasok`);

--
-- Indexes for table `pembayaran`
--
ALTER TABLE `pembayaran`
  ADD PRIMARY KEY (`id_pembayaran`);

--
-- Indexes for table `pembeli`
--
ALTER TABLE `pembeli`
  ADD PRIMARY KEY (`id_pembeli`);

--
-- Indexes for table `penjualan`
--
ALTER TABLE `penjualan`
  ADD PRIMARY KEY (`id_penjualan`),
  ADD KEY `id_pembayaran` (`id_pembayaran`),
  ADD KEY `no_mesin` (`no_mesin`),
  ADD KEY `id_pembeli` (`id_pembeli`);

--
-- Indexes for table `profile`
--
ALTER TABLE `profile`
  ADD UNIQUE KEY `NIK` (`NIK`),
  ADD KEY `username` (`username`);

--
-- Indexes for table `stok`
--
ALTER TABLE `stok`
  ADD PRIMARY KEY (`dealer`,`model`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `angsuran`
--
ALTER TABLE `angsuran`
  MODIFY `id_gantung` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;
--
-- AUTO_INCREMENT for table `barang_masuk`
--
ALTER TABLE `barang_masuk`
  MODIFY `id_masuk` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;
--
-- AUTO_INCREMENT for table `pemasok`
--
ALTER TABLE `pemasok`
  MODIFY `id_pemasok` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;
--
-- AUTO_INCREMENT for table `pembayaran`
--
ALTER TABLE `pembayaran`
  MODIFY `id_pembayaran` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
--
-- AUTO_INCREMENT for table `pembeli`
--
ALTER TABLE `pembeli`
  MODIFY `id_pembeli` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
--
-- AUTO_INCREMENT for table `penjualan`
--
ALTER TABLE `penjualan`
  MODIFY `id_penjualan` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `angsuran`
--
ALTER TABLE `angsuran`
  ADD CONSTRAINT `angsuran_ibfk_1` FOREIGN KEY (`id_pembayaran`) REFERENCES `pembayaran` (`id_pembayaran`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Ketidakleluasaan untuk tabel `barang_masuk`
--
ALTER TABLE `barang_masuk`
  ADD CONSTRAINT `barang_masuk_ibfk_3` FOREIGN KEY (`id_pemasok`) REFERENCES `pemasok` (`id_pemasok`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `barang_masuk_ibfk_4` FOREIGN KEY (`no_mesin`) REFERENCES `barang` (`no_mesin`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Ketidakleluasaan untuk tabel `penjualan`
--
ALTER TABLE `penjualan`
  ADD CONSTRAINT `penjualan_ibfk_1` FOREIGN KEY (`id_pembayaran`) REFERENCES `pembayaran` (`id_pembayaran`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `penjualan_ibfk_2` FOREIGN KEY (`no_mesin`) REFERENCES `barang` (`no_mesin`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `penjualan_ibfk_3` FOREIGN KEY (`id_pembeli`) REFERENCES `pembeli` (`id_pembeli`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Ketidakleluasaan untuk tabel `profile`
--
ALTER TABLE `profile`
  ADD CONSTRAINT `profile_ibfk_1` FOREIGN KEY (`username`) REFERENCES `user` (`username`) ON DELETE CASCADE ON UPDATE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
