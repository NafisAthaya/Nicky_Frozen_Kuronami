-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jul 03, 2026 at 10:31 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `kuronami_pos`
--

-- --------------------------------------------------------

--
-- Table structure for table `cabangs`
--

CREATE TABLE `cabangs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nama_cabang` varchar(255) NOT NULL,
  `alamat` text NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `manajer` varchar(255) DEFAULT NULL,
  `jam_operasional` varchar(255) NOT NULL DEFAULT '08:00 - 21:00',
  `status` varchar(255) NOT NULL DEFAULT 'Buka'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `cabangs`
--

INSERT INTO `cabangs` (`id`, `nama_cabang`, `alamat`, `created_at`, `updated_at`, `manajer`, `jam_operasional`, `status`) VALUES
(1, 'Cabang A - Pasar Minggu', 'Jl. Raya Pasar Minggu No. 45, Pejaten Timur, Jakarta Selatan.', '2026-06-22 03:02:11', '2026-06-22 03:02:11', NULL, '08:00 - 21:00', 'Buka'),
(2, 'Cabang B - BSD City', 'Ruko CBD BSD Lot 2, Jl. Pahlawan Seribu, Lengkong Gudang, Tangerang Selatan.', '2026-06-22 03:02:11', '2026-06-22 03:02:11', NULL, '08:00 - 21:00', 'Buka');

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `detail_transaksis`
--

CREATE TABLE `detail_transaksis` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `transaksi_id` bigint(20) UNSIGNED NOT NULL,
  `produk_id` bigint(20) UNSIGNED NOT NULL,
  `produk_batch_id` bigint(20) UNSIGNED DEFAULT NULL,
  `qty` int(11) NOT NULL,
  `harga_satuan` decimal(15,2) NOT NULL,
  `subtotal` decimal(15,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `detail_transaksis`
--

INSERT INTO `detail_transaksis` (`id`, `transaksi_id`, `produk_id`, `produk_batch_id`, `qty`, `harga_satuan`, `subtotal`, `created_at`, `updated_at`) VALUES
(1, 1, 1, NULL, 2, 25000.00, 50000.00, '2026-06-22 20:03:21', '2026-06-22 20:03:21'),
(2, 2, 2, NULL, 1, 22000.00, 22000.00, '2026-06-22 20:10:02', '2026-06-22 20:10:02'),
(3, 2, 1, NULL, 1, 25000.00, 25000.00, '2026-06-22 20:10:02', '2026-06-22 20:10:02'),
(4, 3, 3, NULL, 2, 19000.00, 38000.00, '2026-06-22 22:33:58', '2026-06-22 22:33:58'),
(5, 4, 2, NULL, 1, 22000.00, 22000.00, '2026-06-22 22:40:38', '2026-06-22 22:40:38'),
(6, 5, 3, NULL, 1, 19000.00, 19000.00, '2026-06-22 22:47:16', '2026-06-22 22:47:16'),
(7, 5, 2, NULL, 1, 22000.00, 22000.00, '2026-06-22 22:47:16', '2026-06-22 22:47:16'),
(8, 6, 3, NULL, 1, 19000.00, 19000.00, '2026-06-23 02:15:57', '2026-06-23 02:15:57'),
(9, 6, 63, NULL, 1, 22000.00, 22000.00, '2026-06-23 02:15:57', '2026-06-23 02:15:57'),
(10, 6, 62, NULL, 1, 16000.00, 16000.00, '2026-06-23 02:15:57', '2026-06-23 02:15:57'),
(11, 7, 5, NULL, 1, 60000.00, 60000.00, '2026-06-30 08:27:17', '2026-06-30 08:27:17'),
(12, 7, 50, NULL, 1, 42000.00, 42000.00, '2026-06-30 08:27:17', '2026-06-30 08:27:17'),
(13, 8, 1, NULL, 1, 25000.00, 25000.00, '2026-06-30 08:35:52', '2026-06-30 08:35:52'),
(14, 8, 2, NULL, 1, 22000.00, 22000.00, '2026-06-30 08:35:52', '2026-06-30 08:35:52'),
(15, 9, 1, NULL, 1, 25000.00, 25000.00, '2026-06-30 08:44:34', '2026-06-30 08:44:34'),
(16, 9, 2, NULL, 1, 22000.00, 22000.00, '2026-06-30 08:44:34', '2026-06-30 08:44:34');

-- --------------------------------------------------------

--
-- Table structure for table `diskon_rules`
--

CREATE TABLE `diskon_rules` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `cabang_id` bigint(20) UNSIGNED NOT NULL,
  `nama_aturan` varchar(255) NOT NULL,
  `pemicu_hari` int(11) NOT NULL,
  `diskon_persen` int(11) NOT NULL,
  `target_kategori` varchar(255) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` varchar(255) NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `hold_orders`
--

CREATE TABLE `hold_orders` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `no_antrian` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `cabang_id` bigint(20) UNSIGNED NOT NULL,
  `nama_pelanggan` varchar(255) DEFAULT NULL,
  `subtotal` decimal(12,2) NOT NULL,
  `status` enum('hold','completed') NOT NULL DEFAULT 'hold',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `hold_order_items`
--

CREATE TABLE `hold_order_items` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `hold_order_id` bigint(20) UNSIGNED NOT NULL,
  `produk_id` bigint(20) UNSIGNED NOT NULL,
  `qty` int(11) NOT NULL,
  `harga` decimal(12,2) NOT NULL,
  `subtotal` decimal(12,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` smallint(5) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `kategoris`
--

CREATE TABLE `kategoris` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nama_kategori` varchar(255) NOT NULL,
  `cabang_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0000_01_01_000000_create_cabangs_table', 1),
(2, '0001_01_01_000000_create_users_table', 1),
(3, '0001_01_01_000001_create_cache_table', 1),
(4, '0001_01_01_000002_create_jobs_table', 1),
(5, '2026_06_18_000010_create_produks_table', 1),
(6, '2026_06_18_000020_create_produk_batches_table', 1),
(7, '2026_06_18_050620_create_transaksis_table', 1),
(8, '2026_06_18_050621_create_detail_transaksis_table', 1),
(9, '2026_06_18_050839_create_pengeluarans_table', 1),
(10, '2026_06_21_110024_add_email_to_users_table', 2),
(11, '2026_06_20_175156_create_personal_access_tokens_table', 3),
(12, '2026_06_25_031321_create_diskon_rules_table', 3),
(13, '2026_06_25_032357_add_details_to_cabangs_table', 3),
(14, '2026_06_25_045345_add_custom_fields_to_users_table', 4),
(15, '2026_06_27_181121_create_notifikasis_table', 4),
(16, '2026_06_30_085312_create_pengaturan_tokos_table', 4),
(17, '2026_06_30_140221_add_foto_to_users_table', 4),
(18, '2026_06_30_172327_create_hold_orders_table', 4),
(19, '2026_06_30_172332_create_hold_order_items_table', 4),
(20, '2026_07_02_045617_add_details_to_produk_batches_table', 5);

-- --------------------------------------------------------

--
-- Table structure for table `notifikasis`
--

CREATE TABLE `notifikasis` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `cabang_id` bigint(20) UNSIGNED NOT NULL,
  `type` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `username` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pengajuan_stoks`
--

CREATE TABLE `pengajuan_stoks` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `produk_id` bigint(20) UNSIGNED NOT NULL,
  `admin_id` bigint(20) UNSIGNED NOT NULL,
  `cabang_id` bigint(20) UNSIGNED NOT NULL,
  `jumlah_request` int(11) NOT NULL,
  `catatan` text DEFAULT NULL,
  `status` enum('pending','disetujui','ditolak') NOT NULL DEFAULT 'pending',
  `tanggal_pengajuan` date NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pengaturan_tokos`
--

CREATE TABLE `pengaturan_tokos` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `cabang_id` bigint(20) UNSIGNED NOT NULL,
  `pajak_persen` int(11) NOT NULL DEFAULT 0,
  `layanan_persen` int(11) NOT NULL DEFAULT 0,
  `harga_termasuk_pajak` tinyint(1) NOT NULL DEFAULT 0,
  `aktifkan_pembulatan` tinyint(1) NOT NULL DEFAULT 0,
  `nominal_pembulatan` int(11) NOT NULL DEFAULT 100,
  `arah_pembulatan` varchar(255) NOT NULL DEFAULT 'terdekat',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `pengaturan_tokos`
--

INSERT INTO `pengaturan_tokos` (`id`, `cabang_id`, `pajak_persen`, `layanan_persen`, `harga_termasuk_pajak`, `aktifkan_pembulatan`, `nominal_pembulatan`, `arah_pembulatan`, `created_at`, `updated_at`) VALUES
(1, 1, 0, 0, 0, 0, 100, 'terdekat', '2026-07-02 23:58:52', '2026-07-02 23:58:52');

-- --------------------------------------------------------

--
-- Table structure for table `pengeluarans`
--

CREATE TABLE `pengeluarans` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `cabang_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `kategori` varchar(255) NOT NULL,
  `nama_biaya` varchar(255) NOT NULL,
  `nominal` decimal(15,2) NOT NULL,
  `tanggal` date NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `pengeluarans`
--

INSERT INTO `pengeluarans` (`id`, `cabang_id`, `user_id`, `kategori`, `nama_biaya`, `nominal`, `tanggal`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 'operasional', 'Bayar Parkir', 5000.00, '2026-06-23', '2026-06-22 21:29:22', '2026-06-22 21:29:22'),
(2, 1, 1, 'lainnya', 'beli tisu', 10000.00, '2026-06-23', '2026-06-22 21:34:56', '2026-06-22 21:34:56');

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` text NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(1, 'App\\Models\\User', 1, 'auth_token', 'b90f2add455bccbf3a6365575667ef506c2b497d2fed75ed1168063877bf5e3d', '[\"*\"]', NULL, NULL, '2026-07-01 19:49:18', '2026-07-01 19:49:18'),
(2, 'App\\Models\\User', 4, 'auth_token', '4c37bd699b3f15de8ac1f0c1e7f663c6b710348a7216970a68bda85f46a9de95', '[\"*\"]', '2026-07-01 19:52:05', NULL, '2026-07-01 19:49:29', '2026-07-01 19:52:05'),
(3, 'App\\Models\\User', 4, 'auth_token', 'ae17888c03a151caa1273c1b813eb6c4f6bfcb3975a1512f4f2e76ddc8037676', '[\"*\"]', '2026-07-01 19:55:14', NULL, '2026-07-01 19:53:49', '2026-07-01 19:55:14'),
(4, 'App\\Models\\User', 6, 'auth_token', '7a523462acc390cd25a075312482035871d0e8df11ff3ef7efd5a27393fc29ce', '[\"*\"]', NULL, NULL, '2026-07-01 19:55:22', '2026-07-01 19:55:22'),
(5, 'App\\Models\\User', 6, 'auth_token', 'a91331f02982b7898c30e9716badfc453e4029b509dbbc07e121ac3d593e5937', '[\"*\"]', NULL, NULL, '2026-07-01 19:56:37', '2026-07-01 19:56:37'),
(6, 'App\\Models\\User', 6, 'auth_token', '1c184faeff76e3f617ab7a184ed19d37eef20057717a3ad860ab967d53e5e024', '[\"*\"]', NULL, NULL, '2026-07-01 19:58:08', '2026-07-01 19:58:08'),
(7, 'App\\Models\\User', 6, 'auth_token', 'e958e8bb3360ae2962df2acfbb0ef3f46d423af2395afec774abefcda656ec57', '[\"*\"]', NULL, NULL, '2026-07-01 19:58:17', '2026-07-01 19:58:17'),
(8, 'App\\Models\\User', 6, 'auth_token', 'a71f53a596017cf298db3b8d2365d7d86fac14fc434c4f0d6b2f9d1c7087e0f4', '[\"*\"]', NULL, NULL, '2026-07-01 20:41:27', '2026-07-01 20:41:27'),
(9, 'App\\Models\\User', 1, 'auth_token', 'acd25a99101551bfaf0e72d8f3c87b8c43cbcdf95d4d74e7ff81219c6d7ba287', '[\"*\"]', NULL, NULL, '2026-07-01 21:01:05', '2026-07-01 21:01:05'),
(10, 'App\\Models\\User', 4, 'auth_token', '256a145348d4324f28030cd982ecebdbed18bf486c31feee85049ebf77d2540b', '[\"*\"]', NULL, NULL, '2026-07-01 21:10:18', '2026-07-01 21:10:18'),
(11, 'App\\Models\\User', 1, 'auth_token', '0a7f6f660792dab61ba80bf3e54c23bdcaed410406aa97fd793d07c23d8e64f5', '[\"*\"]', NULL, NULL, '2026-07-01 23:08:37', '2026-07-01 23:08:37'),
(12, 'App\\Models\\User', 1, 'auth_token', '0c295c187956ad919ad159c055b176e142eaa89d4b8f2b6a0d0a57b704b3c76f', '[\"*\"]', NULL, NULL, '2026-07-01 23:19:12', '2026-07-01 23:19:12'),
(13, 'App\\Models\\User', 1, 'auth_token', '96f77d5229652de71f5943efdf92715848c7e3374ff4164974029be14ed4f6f6', '[\"*\"]', NULL, NULL, '2026-07-01 23:52:16', '2026-07-01 23:52:16'),
(14, 'App\\Models\\User', 4, 'auth_token', '4baa840c1868f64277527edb9dd40dbe28f2499fad1ab4edc6b90b34a067d25d', '[\"*\"]', NULL, NULL, '2026-07-02 00:20:57', '2026-07-02 00:20:57'),
(15, 'App\\Models\\User', 6, 'auth_token', '6667a8479597c9b6342ef96045bbc3093d90c7a3d59daa8702ee252e31600f3a', '[\"*\"]', NULL, NULL, '2026-07-02 00:21:23', '2026-07-02 00:21:23'),
(16, 'App\\Models\\User', 4, 'auth_token', 'af001cfae0a7cdb5530d8e24443c92bf01ba2ad4e17c587fd6dfabe2d8f2040e', '[\"*\"]', NULL, NULL, '2026-07-02 00:22:02', '2026-07-02 00:22:02'),
(17, 'App\\Models\\User', 6, 'auth_token', 'b3183e95e402ebd5999b0f0f3024c74c2e5219b7abaf02fcbc67dc20a34bae52', '[\"*\"]', NULL, NULL, '2026-07-02 21:11:46', '2026-07-02 21:11:46'),
(18, 'App\\Models\\User', 4, 'auth_token', 'c4fd8a2df97799804bc5a5718ec942852c07b6386bb6f289acc3949b747146c3', '[\"*\"]', NULL, NULL, '2026-07-02 21:13:22', '2026-07-02 21:13:22'),
(19, 'App\\Models\\User', 1, 'auth_token', 'bf5f186cc6a1918d3e09503977bfeb0afe5ed0bdd1b9e114a7d9524502b1cc2e', '[\"*\"]', NULL, NULL, '2026-07-02 21:23:23', '2026-07-02 21:23:23'),
(20, 'App\\Models\\User', 6, 'auth_token', '00e0b54bd64ad8c471e66550c5babf7f576f1d106ab3edd8b45a8b1d2bc8dd1a', '[\"*\"]', NULL, NULL, '2026-07-02 21:25:29', '2026-07-02 21:25:29'),
(21, 'App\\Models\\User', 1, 'auth_token', '1f5572dfd7ba97ac5ab557fd7778c9131895b139597470a216e404f0a4abb6b2', '[\"*\"]', NULL, NULL, '2026-07-02 22:45:50', '2026-07-02 22:45:50'),
(22, 'App\\Models\\User', 4, 'auth_token', '36e6cfd21ed62c6740c0dca338308787cc0acaf8674b04c6eb4de1f82bb4c16a', '[\"*\"]', NULL, NULL, '2026-07-02 22:49:48', '2026-07-02 22:49:48'),
(23, 'App\\Models\\User', 1, 'auth_token', '8aa805c7b4d4bbb9b93e777c297ee05784e422ad39adc16ae369266edbcf918a', '[\"*\"]', '2026-07-02 23:51:54', NULL, '2026-07-02 22:57:33', '2026-07-02 23:51:54'),
(24, 'App\\Models\\User', 4, 'auth_token', '7fdc77540783a58212d604ddf662e9ca4f5a3d975b3aeddbe4192635861a61a7', '[\"*\"]', NULL, NULL, '2026-07-02 23:55:49', '2026-07-02 23:55:49'),
(25, 'App\\Models\\User', 1, 'auth_token', 'e52c6a931ca550db0a4e6879189187740aff1ff3463647b45eaeea4d42fd4a75', '[\"*\"]', '2026-07-02 23:58:11', NULL, '2026-07-02 23:58:01', '2026-07-02 23:58:11'),
(26, 'App\\Models\\User', 6, 'auth_token', 'de3d485959d178cd6382a93c607a2b7a60abe1b9981aaa195d04ab057a718ce2', '[\"*\"]', '2026-07-02 23:59:15', NULL, '2026-07-02 23:58:52', '2026-07-02 23:59:15'),
(27, 'App\\Models\\User', 4, 'auth_token', '883e039de1a987bfe0282bf1a45fa8c393fc18149d3972c5c7a219a6eeb00d92', '[\"*\"]', NULL, NULL, '2026-07-02 23:59:25', '2026-07-02 23:59:25'),
(28, 'App\\Models\\User', 1, 'auth_token', '17e642190c2c4d7e38b1eb3c5a062680b89dac2972eb7a97be2fb7f6a60ff03c', '[\"*\"]', '2026-07-03 00:10:39', NULL, '2026-07-03 00:08:35', '2026-07-03 00:10:39'),
(29, 'App\\Models\\User', 4, 'auth_token', '1cfb9aa481b68835db379d4977923e2dddc95f3f1fab108b6549494457fa96d3', '[\"*\"]', NULL, NULL, '2026-07-03 00:11:16', '2026-07-03 00:11:16'),
(30, 'App\\Models\\User', 1, 'auth_token', 'aa8710fbd4ea0d68f2f6e1be76cc07798e98e2b921965bd5d22305382d1a51d4', '[\"*\"]', NULL, NULL, '2026-07-03 00:40:18', '2026-07-03 00:40:18'),
(31, 'App\\Models\\User', 4, 'auth_token', '8d3a44468a6a6333b707cbde191b79ea684c94c77c689e433b79f94e5ff476dd', '[\"*\"]', NULL, NULL, '2026-07-03 00:40:34', '2026-07-03 00:40:34'),
(32, 'App\\Models\\User', 1, 'auth_token', 'afeffe4b8cba984bb71ddb6a6a3220dd7ac88b19b479562fd4f2f350d86a8f1f', '[\"*\"]', '2026-07-03 01:13:50', NULL, '2026-07-03 01:13:15', '2026-07-03 01:13:50');

-- --------------------------------------------------------

--
-- Table structure for table `produks`
--

CREATE TABLE `produks` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `sku` varchar(255) NOT NULL,
  `nama_produk` varchar(255) NOT NULL,
  `kategori_id` bigint(20) UNSIGNED DEFAULT NULL,
  `kategori` varchar(255) NOT NULL,
  `harga_beli` decimal(15,2) NOT NULL,
  `harga_jual` decimal(15,2) DEFAULT 0.00,
  `stok_total` int(11) NOT NULL DEFAULT 0,
  `gambar` varchar(255) DEFAULT NULL,
  `cabang_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `produks`
--

INSERT INTO `produks` (`id`, `sku`, `nama_produk`, `kategori_id`, `kategori`, `harga_beli`, `harga_jual`, `stok_total`, `gambar`, `cabang_id`, `created_at`, `updated_at`) VALUES
(1, 'SKU001', 'Chicken Nugget Premium', NULL, 'Olahan', 20000.00, 25000.00, 95, 'Kategori 4_Olahan/CHICKEN NUGGET PREMIUM.png', 1, '2026-06-23 02:33:09', '2026-06-30 08:44:34'),
(2, 'SKU002', 'Bakso Sapi Ayam', NULL, 'Olahan', 18000.00, 22000.00, 75, 'Kategori 4_Olahan/BAKSO SAPI & AYAM SIAP REBUS.png', 1, '2026-06-23 02:33:09', '2026-06-30 08:44:34'),
(3, 'SKU003', 'Sosis Ayam', NULL, 'Olahan', 15000.00, 19000.00, 346, 'Kategori 4_Olahan/SOSIS SAPI & AYAM PREMIUM.png', 1, '2026-06-23 02:33:09', '2026-07-01 21:58:33'),
(4, 'SKU004', 'Beef Slice Shortplate', NULL, 'Daging Sapi', 50000.00, 65000.00, 100, 'Kategori 1_Daging Sapi/Beef Slice Shortplate.png', 1, '2026-06-23 06:16:25', '2026-06-23 06:16:25'),
(5, 'SKU005', 'Daging Rendang Semur', NULL, 'Daging Sapi', 45000.00, 60000.00, 99, 'Kategori 1_Daging Sapi/Daging Rendang Semur.png', 1, '2026-06-23 06:16:25', '2026-06-30 08:27:17'),
(6, 'SKU006', 'Premium Ground Beef', NULL, 'Daging Sapi', 55000.00, 70000.00, 100, 'Kategori 1_Daging Sapi/Premium Ground Beef.png', 1, '2026-06-23 06:16:25', '2026-06-23 06:16:25'),
(7, 'SKU007', 'Premium Ribeye Steak', NULL, 'Daging Sapi', 85000.00, 110000.00, 100, 'Kategori 1_Daging Sapi/Premium Ribeye Steak.png', 1, '2026-06-23 06:16:25', '2026-06-23 06:16:25'),
(48, 'SKU008', 'Ayam Fillet Boneless', NULL, 'Ayam', 35000.00, 48000.00, 180, 'Kategori 2_Ayam/Ayam Fillet Boneless.png', 1, '2026-06-23 06:19:30', '2026-07-01 21:46:31'),
(49, 'SKU009', 'Ayam Goreng Lengkuas', NULL, 'Ayam', 28000.00, 39000.00, 130, 'Kategori 2_Ayam/Ayam Goreng Lengkuas.png', 1, '2026-06-23 06:19:30', '2026-06-30 09:11:01'),
(50, 'SKU010', 'Ayam Ungkep Bumbu Kuning', NULL, 'Ayam', 30000.00, 42000.00, 119, 'Kategori 2_Ayam/Ayam Ungkep Bumbu Kuning.png', 1, '2026-06-23 06:19:30', '2026-06-30 08:27:17'),
(51, 'SKU011', 'Boneless Chicken Breasts', NULL, 'Ayam', 38000.00, 52000.00, 130, 'Kategori 2_Ayam/Boneless Chicken Breasts.png', 1, '2026-06-23 06:19:30', '2026-06-23 06:19:30'),
(52, 'SKU012', 'Cumi Ring', NULL, 'Seafood', 42000.00, 58000.00, 90, 'Kategori 3_Seafood/Cumi Ring.png', 1, '2026-06-23 06:19:30', '2026-06-30 09:11:25'),
(53, 'SKU013', 'Fillet Ikan Dori', NULL, 'Seafood', 35000.00, 49000.00, 100, 'Kategori 3_Seafood/Fillet Ikan Dori.png', 1, '2026-06-23 06:19:30', '2026-06-23 06:19:30'),
(54, 'SKU014', 'Fillet Salmon', NULL, 'Seafood', 75000.00, 95000.00, 60, 'Kategori 3_Seafood/Fillet Salmon.png', 1, '2026-06-23 06:19:30', '2026-06-23 06:19:30'),
(55, 'SKU015', 'Norwegian Salmon', NULL, 'Seafood', 70000.00, 85000.00, 80, 'Kategori 3_Seafood/Norwegian Salmon.png', 1, '2026-06-23 06:19:30', '2026-07-01 21:17:41'),
(56, 'SKU016', 'Udang Kupas Tail-on', NULL, 'Seafood', 65000.00, 82000.00, 75, 'Kategori 3_Seafood/Udang Kupas Tail-on.png', 1, '2026-06-23 06:19:30', '2026-06-23 06:19:30'),
(57, 'SKU017', 'Dimsum Ayam & Udang', NULL, 'Olahan', 25000.00, 35000.00, 90, 'Kategori 4_Olahan/DIMSUM AYAM & UDANG.png', 1, '2026-06-23 06:19:30', '2026-06-23 06:19:30'),
(58, 'SKU018', 'Risol Mayo Cireng Rujak Beku', NULL, 'Olahan', 18000.00, 25000.00, 85, 'Kategori 4_Olahan/RISOL MAYO CIRENG RUJAK BEKU.png', 1, '2026-06-23 06:19:30', '2026-06-23 06:19:30'),
(59, 'SKU019', 'Sosis Sapi Bratwurst', NULL, 'Olahan', 40000.00, 55000.00, 95, 'Kategori 4_Olahan/Sosis Sapi Bratwurst.png', 1, '2026-06-23 06:19:30', '2026-06-23 06:19:30'),
(60, 'SKU020', 'Brokoli', NULL, 'Sayuran', 12000.00, 18000.00, 110, 'Kategori 5_Sayuran/Brokoli.png', 1, '2026-06-23 06:19:30', '2026-06-30 09:10:25'),
(61, 'SKU021', 'French Fries Mix', NULL, 'Sayuran', 18000.00, 28000.00, 120, 'Kategori 5_Sayuran/French Fries Mix.png', 1, '2026-06-23 06:19:30', '2026-06-23 06:19:30'),
(62, 'SKU022', 'Jagung Manis Pipil', NULL, 'Sayuran', 10000.00, 16000.00, 149, 'Kategori 5_Sayuran/Jagung Manis Pipil.png', 1, '2026-06-23 06:19:30', '2026-06-23 02:15:57'),
(63, 'SKU023', 'Mixed Vegetables', NULL, 'Sayuran', 15000.00, 22000.00, 129, 'Kategori 5_Sayuran/Mixed Vegetables.png', 1, '2026-06-23 06:19:30', '2026-06-23 02:15:57');

-- --------------------------------------------------------

--
-- Table structure for table `produk_batches`
--

CREATE TABLE `produk_batches` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `produk_id` bigint(20) UNSIGNED NOT NULL,
  `supplier_id` bigint(20) UNSIGNED DEFAULT NULL,
  `barcode_custom` varchar(255) NOT NULL,
  `stok` int(11) NOT NULL,
  `expired_date` date NOT NULL,
  `tanggal_masuk` date NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `harga_beli` decimal(15,2) DEFAULT NULL,
  `supplier` varchar(255) DEFAULT NULL,
  `catatan` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `produk_batches`
--

INSERT INTO `produk_batches` (`id`, `produk_id`, `supplier_id`, `barcode_custom`, `stok`, `expired_date`, `tanggal_masuk`, `created_at`, `updated_at`, `harga_beli`, `supplier`, `catatan`) VALUES
(1, 48, NULL, 'BC-5OICCXST', 10, '2026-07-02', '2026-06-30', '2026-06-30 08:48:17', '2026-06-30 08:48:17', NULL, NULL, NULL),
(2, 49, NULL, 'BC-PKDL1LXT', 10, '2026-10-31', '2026-06-30', '2026-06-30 09:09:56', '2026-06-30 09:09:56', NULL, NULL, NULL),
(3, 60, NULL, 'BC-LNNQXDTW', 10, '2026-07-30', '2026-06-30', '2026-06-30 09:10:25', '2026-06-30 09:10:25', NULL, NULL, NULL),
(4, 49, NULL, 'BC-NJGSIVJZ', 10, '2026-07-07', '2026-06-30', '2026-06-30 09:11:01', '2026-06-30 09:11:01', NULL, NULL, NULL),
(5, 52, NULL, 'BC-498HRHIZ', 10, '2026-07-30', '2026-06-30', '2026-06-30 09:11:25', '2026-06-30 09:11:25', NULL, NULL, NULL),
(6, 48, NULL, 'BC-MCPYSURJ', 20, '2026-10-16', '2026-07-02', '2026-07-01 21:46:31', '2026-07-01 21:46:31', NULL, NULL, NULL),
(7, 3, NULL, 'BC-1AAEBYSX', 230, '2026-09-25', '2026-07-02', '2026-07-01 21:47:21', '2026-07-01 21:58:33', 3000000.00, 'shopee', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `sesi_kasirs`
--

CREATE TABLE `sesi_kasirs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `cabang_id` bigint(20) UNSIGNED NOT NULL,
  `waktu_mulai` timestamp NOT NULL DEFAULT current_timestamp(),
  `waktu_selesai` timestamp NULL DEFAULT NULL,
  `tunai_sistem` decimal(15,2) NOT NULL DEFAULT 0.00,
  `tunai_laci` decimal(15,2) DEFAULT NULL,
  `selisih` decimal(15,2) DEFAULT NULL,
  `status` enum('aktif','selesai') NOT NULL DEFAULT 'aktif',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('02thX0nKQvUh5yfbGyozHfSR9pZZqlvOKWHdx20F', NULL, '127.0.0.1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', 'eyJfdG9rZW4iOiJTcWpWaGJNQ2pmVUhhVjd3U3lGTGgwaWJQZTBnOE9EdFdFOGFkd0hKIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwIiwicm91dGUiOm51bGx9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1782963672),
('DcH5BnCdJfzXIM0rShrm58MGSjX11mv6XeRL8xRT', NULL, '127.0.0.1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', 'eyJfdG9rZW4iOiJUeGh1c0ZKS3ZSREdxY25ZWFNoUTdTZG5za25wU2tFYzVLN2Z0aVpvIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwIiwicm91dGUiOm51bGx9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1782908297),
('ExhtuFTxdqmzMxnP1SvGQUr9VBr42kemms8lPC1l', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:152.0) Gecko/20100101 Firefox/152.0', 'eyJfdG9rZW4iOiJ1RVczdUxqZGIxS05CZlcxMmI3V3RQdk9TSlUza2l5ZFNOOFBac3dsIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwIiwicm91dGUiOm51bGx9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1782048885),
('lKUpC7um8Jt0xrK4spSVcJT9DepeVpgqrEWxbh6e', NULL, '127.0.0.1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', 'eyJfdG9rZW4iOiJ6bXUxTXBRU3cxRXhtbFJMOUZBRFk5WjJaUjc4Q0htcG92TTNwT0dDIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwIiwicm91dGUiOm51bGx9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1782888842),
('My2EP8wlikJuWrnRDoNyquJoOJ1rAe22V04DWSpU', NULL, '127.0.0.1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', 'eyJfdG9rZW4iOiJtc0M5ZjQ1Z1V4N1d4Q0puOUZWSzFZR0llTjh1R2V5eUFpbnNvRGdQIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwIiwicm91dGUiOm51bGx9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1783051372),
('uObk9IVDFCZBCFiuObvJCzwsMxSgZrXrh0bEeu0P', NULL, '127.0.0.1', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', 'eyJfdG9rZW4iOiI4T1N6cXZzY3VFc3RGWkZJS1BUVzNyUlIwSlNGcEJ0ZkhKVGZUVGZGIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwIiwicm91dGUiOm51bGx9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1782955594),
('Xz2ZpUHrjFBfvsDE1oVNdgQKPzhFizVv03t1AGpz', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:152.0) Gecko/20100101 Firefox/152.0', 'eyJfdG9rZW4iOiJQVDRWY2xyUE1yZFZqMlhtRnZUQk5kczR0ejZVZW5GTG8weFdWWjhoIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwIiwicm91dGUiOm51bGx9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1782040701);

-- --------------------------------------------------------

--
-- Table structure for table `suppliers`
--

CREATE TABLE `suppliers` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nama_supplier` varchar(255) NOT NULL,
  `kontak` varchar(255) DEFAULT NULL,
  `alamat` text DEFAULT NULL,
  `cabang_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `transaksis`
--

CREATE TABLE `transaksis` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `no_transaksi` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `cabang_id` bigint(20) UNSIGNED NOT NULL,
  `nama_pelanggan` varchar(255) DEFAULT NULL,
  `subtotal` decimal(15,2) NOT NULL,
  `pajak` decimal(15,2) NOT NULL DEFAULT 0.00,
  `pembulatan_donasi` decimal(15,2) NOT NULL DEFAULT 0.00,
  `diskon` decimal(15,2) NOT NULL DEFAULT 0.00,
  `total_tagihan` decimal(15,2) NOT NULL,
  `metode_pembayaran` enum('tunai','transfer','debit','qris') NOT NULL,
  `uang_diterima` decimal(15,2) DEFAULT NULL,
  `kembalian` decimal(15,2) DEFAULT NULL,
  `status` enum('berhasil','pending','dibatalkan') NOT NULL DEFAULT 'berhasil',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `transaksis`
--

INSERT INTO `transaksis` (`id`, `no_transaksi`, `user_id`, `cabang_id`, `nama_pelanggan`, `subtotal`, `pajak`, `pembulatan_donasi`, `diskon`, `total_tagihan`, `metode_pembayaran`, `uang_diterima`, `kembalian`, `status`, `created_at`, `updated_at`) VALUES
(1, 'TRX-1782183801', 1, 1, NULL, 50000.00, 0.00, 0.00, 0.00, 50000.00, 'tunai', 100000.00, 50000.00, 'berhasil', '2026-06-22 20:03:21', '2026-06-22 20:03:21'),
(2, 'TRX-1782184202', 1, 1, NULL, 47000.00, 0.00, 0.00, 0.00, 47000.00, 'tunai', 60000.00, 13000.00, 'berhasil', '2026-06-22 20:10:02', '2026-06-22 20:10:02'),
(3, 'TRX-1782192838', 1, 1, NULL, 38000.00, 0.00, 0.00, 0.00, 38000.00, 'tunai', 50000.00, 12000.00, 'berhasil', '2026-06-22 22:33:58', '2026-06-22 22:33:58'),
(4, 'TRX-1782193237', 1, 1, NULL, 22000.00, 0.00, 0.00, 0.00, 22000.00, 'tunai', 80000.00, 58000.00, 'berhasil', '2026-06-22 22:40:37', '2026-06-22 22:40:37'),
(5, 'TRX-1782193636', 1, 1, NULL, 41000.00, 0.00, 0.00, 0.00, 41000.00, 'tunai', 80000.00, 39000.00, 'berhasil', '2026-06-22 22:47:16', '2026-06-22 22:47:16'),
(6, 'TRX-1782206156', 1, 1, NULL, 57000.00, 0.00, 0.00, 0.00, 57000.00, 'debit', 64000.00, 7000.00, 'berhasil', '2026-06-23 02:15:57', '2026-06-23 02:15:57'),
(7, 'TRX-1782833237', 1, 1, NULL, 102000.00, 0.00, 0.00, 0.00, 102000.00, 'tunai', 120000.00, 18000.00, 'berhasil', '2026-06-30 08:27:17', '2026-06-30 08:27:17'),
(8, 'TRX-1782833752', 1, 1, NULL, 47000.00, 0.00, 0.00, 0.00, 47000.00, 'tunai', 55000.00, 8000.00, 'berhasil', '2026-06-30 08:35:52', '2026-06-30 08:35:52'),
(9, 'TRX-1782834274', 1, 1, NULL, 47000.00, 0.00, 0.00, 0.00, 53000.00, 'tunai', 55000.00, 2000.00, 'berhasil', '2026-06-30 08:44:34', '2026-06-30 08:44:34');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `foto` varchar(255) DEFAULT NULL,
  `role` enum('owner','kasir','admin') NOT NULL,
  `cabang_id` bigint(20) UNSIGNED DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `username`, `email`, `phone`, `password`, `foto`, `role`, `cabang_id`, `is_active`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'Owner Nicky', 'owner', 'siskaseptiani464@gmail.com', NULL, '$2y$12$nqGEDBg8fWoCB6NSVvJGCeOb/UCID2pB4DEBuWJ09Lh1Hhu.2c.hm', NULL, 'owner', NULL, 1, NULL, '2026-06-21 10:05:53', '2026-06-21 03:09:35'),
(4, 'Admin Cabang A', 'admin_a', 'admina@nickyfrozen.com', NULL, '$2y$12$L5jZwVh6vNhqJAORfN2qN.ranIjNjo3IMSatAuUEYtDcnoK0N/9Bm', NULL, 'admin', 1, 1, NULL, '2026-06-22 03:02:56', '2026-06-21 20:40:00'),
(5, 'Admin Cabang B', 'admin_b', 'adminb@nickyfrozen.com', NULL, '$2y$12$FWUjIjoc97Bfvo.zUbJt4O0DtOewzm6WWqAzrWwDPtAs/cXmRS8EG', NULL, 'admin', 2, 1, NULL, '2026-06-22 03:03:08', '2026-06-21 20:40:00'),
(6, 'Kasir Cabang A', 'kasir_a', 'kasira@nickyfrozen.com', NULL, '$2y$12$UVkxHJKNqGm2W7LSXIN3x.aX9y6dp.XUbimtX6977VYbekp0wWLSy', NULL, 'kasir', 1, 1, NULL, '2026-06-22 03:03:21', '2026-06-21 20:40:01'),
(7, 'Kasir Cabang B', 'kasir_b', 'kasirb@nickyfrozen.com', NULL, '$2y$12$HASH_PASSWORD', NULL, 'kasir', 2, 1, NULL, '2026-06-22 03:03:31', '2026-06-22 03:03:31');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cabangs`
--
ALTER TABLE `cabangs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_expiration_index` (`expiration`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_locks_expiration_index` (`expiration`);

--
-- Indexes for table `detail_transaksis`
--
ALTER TABLE `detail_transaksis`
  ADD PRIMARY KEY (`id`),
  ADD KEY `detail_transaksis_transaksi_id_foreign` (`transaksi_id`),
  ADD KEY `detail_transaksis_produk_id_foreign` (`produk_id`),
  ADD KEY `detail_transaksis_produk_batch_id_foreign` (`produk_batch_id`);

--
-- Indexes for table `diskon_rules`
--
ALTER TABLE `diskon_rules`
  ADD PRIMARY KEY (`id`),
  ADD KEY `diskon_rules_cabang_id_foreign` (`cabang_id`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`),
  ADD KEY `failed_jobs_connection_queue_failed_at_index` (`connection`,`queue`,`failed_at`);

--
-- Indexes for table `hold_orders`
--
ALTER TABLE `hold_orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `hold_orders_user_id_foreign` (`user_id`),
  ADD KEY `hold_orders_cabang_id_foreign` (`cabang_id`);

--
-- Indexes for table `hold_order_items`
--
ALTER TABLE `hold_order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `hold_order_items_hold_order_id_foreign` (`hold_order_id`),
  ADD KEY `hold_order_items_produk_id_foreign` (`produk_id`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `kategoris`
--
ALTER TABLE `kategoris`
  ADD PRIMARY KEY (`id`),
  ADD KEY `kategoris_cabang_id_foreign` (`cabang_id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `notifikasis`
--
ALTER TABLE `notifikasis`
  ADD PRIMARY KEY (`id`),
  ADD KEY `notifikasis_cabang_id_foreign` (`cabang_id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`username`);

--
-- Indexes for table `pengajuan_stoks`
--
ALTER TABLE `pengajuan_stoks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `pengajuan_stoks_produk_id_foreign` (`produk_id`),
  ADD KEY `pengajuan_stoks_admin_id_foreign` (`admin_id`),
  ADD KEY `pengajuan_stoks_cabang_id_foreign` (`cabang_id`);

--
-- Indexes for table `pengaturan_tokos`
--
ALTER TABLE `pengaturan_tokos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `pengaturan_tokos_cabang_id_foreign` (`cabang_id`);

--
-- Indexes for table `pengeluarans`
--
ALTER TABLE `pengeluarans`
  ADD PRIMARY KEY (`id`),
  ADD KEY `pengeluarans_cabang_id_foreign` (`cabang_id`),
  ADD KEY `pengeluarans_user_id_foreign` (`user_id`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  ADD KEY `personal_access_tokens_expires_at_index` (`expires_at`);

--
-- Indexes for table `produks`
--
ALTER TABLE `produks`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `produks_sku_unique` (`sku`),
  ADD KEY `produks_cabang_id_foreign` (`cabang_id`),
  ADD KEY `produks_kategori_id_foreign` (`kategori_id`);

--
-- Indexes for table `produk_batches`
--
ALTER TABLE `produk_batches`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `produk_batches_barcode_custom_unique` (`barcode_custom`),
  ADD KEY `produk_batches_produk_id_foreign` (`produk_id`),
  ADD KEY `produk_batches_supplier_id_foreign` (`supplier_id`);

--
-- Indexes for table `sesi_kasirs`
--
ALTER TABLE `sesi_kasirs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sesi_kasirs_user_id_foreign` (`user_id`),
  ADD KEY `sesi_kasirs_cabang_id_foreign` (`cabang_id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `suppliers`
--
ALTER TABLE `suppliers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `suppliers_cabang_id_foreign` (`cabang_id`);

--
-- Indexes for table `transaksis`
--
ALTER TABLE `transaksis`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `transaksis_no_transaksi_unique` (`no_transaksi`),
  ADD KEY `transaksis_user_id_foreign` (`user_id`),
  ADD KEY `transaksis_cabang_id_foreign` (`cabang_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_username_unique` (`username`),
  ADD UNIQUE KEY `users_email_unique` (`email`),
  ADD KEY `users_cabang_id_foreign` (`cabang_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `cabangs`
--
ALTER TABLE `cabangs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `detail_transaksis`
--
ALTER TABLE `detail_transaksis`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `diskon_rules`
--
ALTER TABLE `diskon_rules`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `hold_orders`
--
ALTER TABLE `hold_orders`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `hold_order_items`
--
ALTER TABLE `hold_order_items`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `kategoris`
--
ALTER TABLE `kategoris`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `notifikasis`
--
ALTER TABLE `notifikasis`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pengajuan_stoks`
--
ALTER TABLE `pengajuan_stoks`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pengaturan_tokos`
--
ALTER TABLE `pengaturan_tokos`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `pengeluarans`
--
ALTER TABLE `pengeluarans`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `produks`
--
ALTER TABLE `produks`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=64;

--
-- AUTO_INCREMENT for table `produk_batches`
--
ALTER TABLE `produk_batches`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `sesi_kasirs`
--
ALTER TABLE `sesi_kasirs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `suppliers`
--
ALTER TABLE `suppliers`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `transaksis`
--
ALTER TABLE `transaksis`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `detail_transaksis`
--
ALTER TABLE `detail_transaksis`
  ADD CONSTRAINT `detail_transaksis_produk_batch_id_foreign` FOREIGN KEY (`produk_batch_id`) REFERENCES `produk_batches` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `detail_transaksis_produk_id_foreign` FOREIGN KEY (`produk_id`) REFERENCES `produks` (`id`),
  ADD CONSTRAINT `detail_transaksis_transaksi_id_foreign` FOREIGN KEY (`transaksi_id`) REFERENCES `transaksis` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `diskon_rules`
--
ALTER TABLE `diskon_rules`
  ADD CONSTRAINT `diskon_rules_cabang_id_foreign` FOREIGN KEY (`cabang_id`) REFERENCES `cabangs` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `hold_orders`
--
ALTER TABLE `hold_orders`
  ADD CONSTRAINT `hold_orders_cabang_id_foreign` FOREIGN KEY (`cabang_id`) REFERENCES `cabangs` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `hold_orders_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `hold_order_items`
--
ALTER TABLE `hold_order_items`
  ADD CONSTRAINT `hold_order_items_hold_order_id_foreign` FOREIGN KEY (`hold_order_id`) REFERENCES `hold_orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `hold_order_items_produk_id_foreign` FOREIGN KEY (`produk_id`) REFERENCES `produks` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `kategoris`
--
ALTER TABLE `kategoris`
  ADD CONSTRAINT `kategoris_cabang_id_foreign` FOREIGN KEY (`cabang_id`) REFERENCES `cabangs` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `notifikasis`
--
ALTER TABLE `notifikasis`
  ADD CONSTRAINT `notifikasis_cabang_id_foreign` FOREIGN KEY (`cabang_id`) REFERENCES `cabangs` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `pengajuan_stoks`
--
ALTER TABLE `pengajuan_stoks`
  ADD CONSTRAINT `pengajuan_stoks_admin_id_foreign` FOREIGN KEY (`admin_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `pengajuan_stoks_cabang_id_foreign` FOREIGN KEY (`cabang_id`) REFERENCES `cabangs` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `pengajuan_stoks_produk_id_foreign` FOREIGN KEY (`produk_id`) REFERENCES `produks` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `pengaturan_tokos`
--
ALTER TABLE `pengaturan_tokos`
  ADD CONSTRAINT `pengaturan_tokos_cabang_id_foreign` FOREIGN KEY (`cabang_id`) REFERENCES `cabangs` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `pengeluarans`
--
ALTER TABLE `pengeluarans`
  ADD CONSTRAINT `pengeluarans_cabang_id_foreign` FOREIGN KEY (`cabang_id`) REFERENCES `cabangs` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `pengeluarans_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `produks`
--
ALTER TABLE `produks`
  ADD CONSTRAINT `produks_cabang_id_foreign` FOREIGN KEY (`cabang_id`) REFERENCES `cabangs` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `produks_kategori_id_foreign` FOREIGN KEY (`kategori_id`) REFERENCES `kategoris` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `produk_batches`
--
ALTER TABLE `produk_batches`
  ADD CONSTRAINT `produk_batches_produk_id_foreign` FOREIGN KEY (`produk_id`) REFERENCES `produks` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `produk_batches_supplier_id_foreign` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `sesi_kasirs`
--
ALTER TABLE `sesi_kasirs`
  ADD CONSTRAINT `sesi_kasirs_cabang_id_foreign` FOREIGN KEY (`cabang_id`) REFERENCES `cabangs` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `sesi_kasirs_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `suppliers`
--
ALTER TABLE `suppliers`
  ADD CONSTRAINT `suppliers_cabang_id_foreign` FOREIGN KEY (`cabang_id`) REFERENCES `cabangs` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `transaksis`
--
ALTER TABLE `transaksis`
  ADD CONSTRAINT `transaksis_cabang_id_foreign` FOREIGN KEY (`cabang_id`) REFERENCES `cabangs` (`id`),
  ADD CONSTRAINT `transaksis_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_cabang_id_foreign` FOREIGN KEY (`cabang_id`) REFERENCES `cabangs` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
