-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2026. Jan 21. 21:46
-- Kiszolgáló verziója: 10.4.32-MariaDB
-- PHP verzió: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `boraszat`
--

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `bor`
--

CREATE TABLE `bor` (
  `id` int(11) NOT NULL,
  `bor_szin_id` int(11) NOT NULL,
  `nev` varchar(100) NOT NULL,
  `evjarat` int(11) NOT NULL,
  `ar` int(11) NOT NULL,
  `keszlet` int(11) NOT NULL DEFAULT 0,
  `alkoholfok` decimal(4,2) DEFAULT NULL,
  `kiszereles_ml` int(11) NOT NULL DEFAULT 750,
  `leiras` text DEFAULT NULL,
  `aktiv` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `bor_szin`
--

CREATE TABLE `bor_szin` (
  `id` int(11) NOT NULL,
  `nev` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `bor_szin`
--

INSERT INTO `bor_szin` (`id`, `nev`) VALUES
(1, 'FEHER'),
(3, 'ROZE'),
(2, 'VOROS');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `fizetes`
--

CREATE TABLE `fizetes` (
  `id` int(11) NOT NULL,
  `rendeles_id` int(11) NOT NULL,
  `fizetesi_mod` enum('KARTYA','UTALAS','UTANVET') NOT NULL,
  `statusz` enum('INIT','SIKERES','SIKERTELEN') NOT NULL DEFAULT 'INIT',
  `tranzakcio_azon` varchar(80) DEFAULT NULL,
  `osszeg` int(11) NOT NULL,
  `datum` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `fizetes`
--

INSERT INTO `fizetes` (`id`, `rendeles_id`, `fizetesi_mod`, `statusz`, `tranzakcio_azon`, `osszeg`, `datum`) VALUES
(1, 1, 'KARTYA', 'SIKERES', NULL, 8700, '2026-01-10 16:38:28');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `foglalas`
--

CREATE TABLE `foglalas` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `szolgaltatas_id` int(11) NOT NULL,
  `erkezes` date DEFAULT NULL,
  `tavozas` date DEFAULT NULL,
  `letszam` int(11) NOT NULL DEFAULT 1,
  `statusz` enum('PENDING','CONFIRMED','CANCELLED') NOT NULL DEFAULT 'PENDING',
  `foglalas_datuma` datetime NOT NULL DEFAULT current_timestamp(),
  `megjegyzes` varchar(255) DEFAULT NULL,
  `osszeg` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `foglalas`
--

INSERT INTO `foglalas` (`id`, `user_id`, `szolgaltatas_id`, `erkezes`, `tavozas`, `letszam`, `statusz`, `foglalas_datuma`, `megjegyzes`, `osszeg`) VALUES
(1, 1, 1, NULL, NULL, 2, 'PENDING', '2026-01-10 16:40:21', NULL, 10000);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `rendeles`
--

CREATE TABLE `rendeles` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `datum` datetime NOT NULL DEFAULT current_timestamp(),
  `statusz` enum('KOSAR','FELDOLGOZAS','FIZETVE','KISZALLITVA','TOROLVE') NOT NULL DEFAULT 'KOSAR',
  `szall_orszag` varchar(60) DEFAULT NULL,
  `szall_irsz` varchar(10) DEFAULT NULL,
  `szall_varos` varchar(80) DEFAULT NULL,
  `szall_utca` varchar(120) DEFAULT NULL,
  `szall_hazszam` varchar(20) DEFAULT NULL,
  `szallitasi_dij` int(11) NOT NULL DEFAULT 0,
  `vegosszeg` int(11) NOT NULL DEFAULT 0,
  `megjegyzes` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `rendeles`
--

INSERT INTO `rendeles` (`id`, `user_id`, `datum`, `statusz`, `szall_orszag`, `szall_irsz`, `szall_varos`, `szall_utca`, `szall_hazszam`, `szallitasi_dij`, `vegosszeg`, `megjegyzes`) VALUES
(1, 1, '2026-01-10 16:33:40', 'KOSAR', NULL, NULL, NULL, NULL, NULL, 1200, 0, NULL);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `rendeles_tetel`
--

CREATE TABLE `rendeles_tetel` (
  `id` int(11) NOT NULL,
  `rendeles_id` int(11) NOT NULL,
  `bor_id` int(11) NOT NULL,
  `mennyiseg` int(11) NOT NULL,
  `egysegar` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `szolgaltatas`
--

CREATE TABLE `szolgaltatas` (
  `id` int(11) NOT NULL,
  `tipus` enum('BORKOSTOLO','SZALLAS') NOT NULL,
  `nev` varchar(120) NOT NULL,
  `kezdete` datetime DEFAULT NULL,
  `vege` datetime DEFAULT NULL,
  `kapacitas` int(11) NOT NULL DEFAULT 1,
  `ar` int(11) NOT NULL,
  `leiras` text DEFAULT NULL,
  `aktiv` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `szolgaltatas`
--

INSERT INTO `szolgaltatas` (`id`, `tipus`, `nev`, `kezdete`, `vege`, `kapacitas`, `ar`, `leiras`, `aktiv`) VALUES
(1, 'BORKOSTOLO', 'Pincejárás + kóstoló', '2026-02-14 18:00:00', '2026-02-14 20:00:00', 20, 8500, NULL, 1),
(2, 'SZALLAS', 'Standard szoba (ár/éj)', NULL, NULL, 2, 25000, NULL, 1),
(3, 'BORKOSTOLO', 'Pincelátogatás', NULL, NULL, 10, 5000, NULL, 1);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(150) CHARACTER SET utf8 COLLATE utf8_hungarian_ci NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('USER','ADMIN') CHARACTER SET utf8 COLLATE utf8_hungarian_ci NOT NULL DEFAULT 'USER',
  `nev` varchar(100) CHARACTER SET utf8 COLLATE utf8_hungarian_ci NOT NULL,
  `telefonszam` varchar(20) CHARACTER SET utf8 COLLATE utf8_hungarian_ci DEFAULT NULL,
  `orszag` varchar(60) CHARACTER SET utf8 COLLATE utf8_hungarian_ci NOT NULL DEFAULT 'Magyarország',
  `irsz` varchar(10) CHARACTER SET utf8 COLLATE utf8_hungarian_ci DEFAULT NULL,
  `varos` varchar(80) CHARACTER SET utf8 COLLATE utf8_hungarian_ci DEFAULT NULL,
  `utca` varchar(120) CHARACTER SET utf8 COLLATE utf8_hungarian_ci DEFAULT NULL,
  `hazszam` varchar(20) CHARACTER SET utf8 COLLATE utf8_hungarian_ci DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `last_login` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `users`
--

INSERT INTO `users` (`id`, `email`, `password_hash`, `role`, `nev`, `telefonszam`, `orszag`, `irsz`, `varos`, `utca`, `hazszam`, `is_active`, `created_at`, `last_login`) VALUES
(1, 'teszt@bor.hu', 'teszt123', 'USER', 'Teszt Elek', '0612345678', 'Magyarország', NULL, NULL, NULL, NULL, 1, '2026-01-10 16:32:53', NULL),
(2, 'bencesinthavong@gmail.com', '$2b$10$oLF8hiELHvXbhrO6gWKIqO2UnwwxtWZm6KTjSLy6I6ptcg7kM02b6', 'USER', 'Sinthavong Bence', '06303216644', 'Magyarország', '8314', 'Vonyarcvashegy', 'Petőfi utca', '12', 1, '2026-01-21 21:26:54', NULL);

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `bor`
--
ALTER TABLE `bor`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_bor` (`bor_szin_id`,`nev`,`evjarat`),
  ADD KEY `idx_bor_szin` (`bor_szin_id`),
  ADD KEY `idx_bor_ar` (`ar`);

--
-- A tábla indexei `bor_szin`
--
ALTER TABLE `bor_szin`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nev` (`nev`);

--
-- A tábla indexei `fizetes`
--
ALTER TABLE `fizetes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `rendeles_id` (`rendeles_id`);

--
-- A tábla indexei `foglalas`
--
ALTER TABLE `foglalas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_foglalas_user` (`user_id`,`foglalas_datuma`),
  ADD KEY `idx_foglalas_szolg` (`szolgaltatas_id`),
  ADD KEY `idx_foglalas_ido` (`erkezes`,`tavozas`);

--
-- A tábla indexei `rendeles`
--
ALTER TABLE `rendeles`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_rendeles_user` (`user_id`,`datum`),
  ADD KEY `idx_rendeles_statusz` (`statusz`);

--
-- A tábla indexei `rendeles_tetel`
--
ALTER TABLE `rendeles_tetel`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_rendeles_bor` (`rendeles_id`,`bor_id`),
  ADD KEY `bor_id` (`bor_id`),
  ADD KEY `idx_tetel_rendeles` (`rendeles_id`);

--
-- A tábla indexei `szolgaltatas`
--
ALTER TABLE `szolgaltatas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_szolg_tipus` (`tipus`),
  ADD KEY `idx_szolg_kezdete` (`kezdete`);

--
-- A tábla indexei `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `bor`
--
ALTER TABLE `bor`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT a táblához `bor_szin`
--
ALTER TABLE `bor_szin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT a táblához `fizetes`
--
ALTER TABLE `fizetes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT a táblához `foglalas`
--
ALTER TABLE `foglalas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT a táblához `rendeles`
--
ALTER TABLE `rendeles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT a táblához `rendeles_tetel`
--
ALTER TABLE `rendeles_tetel`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT a táblához `szolgaltatas`
--
ALTER TABLE `szolgaltatas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT a táblához `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `bor`
--
ALTER TABLE `bor`
  ADD CONSTRAINT `bor_ibfk_1` FOREIGN KEY (`bor_szin_id`) REFERENCES `bor_szin` (`id`) ON UPDATE CASCADE;

--
-- Megkötések a táblához `fizetes`
--
ALTER TABLE `fizetes`
  ADD CONSTRAINT `fizetes_ibfk_1` FOREIGN KEY (`rendeles_id`) REFERENCES `rendeles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Megkötések a táblához `foglalas`
--
ALTER TABLE `foglalas`
  ADD CONSTRAINT `foglalas_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `foglalas_ibfk_2` FOREIGN KEY (`szolgaltatas_id`) REFERENCES `szolgaltatas` (`id`) ON UPDATE CASCADE;

--
-- Megkötések a táblához `rendeles`
--
ALTER TABLE `rendeles`
  ADD CONSTRAINT `rendeles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE;

--
-- Megkötések a táblához `rendeles_tetel`
--
ALTER TABLE `rendeles_tetel`
  ADD CONSTRAINT `rendeles_tetel_ibfk_1` FOREIGN KEY (`rendeles_id`) REFERENCES `rendeles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `rendeles_tetel_ibfk_2` FOREIGN KEY (`bor_id`) REFERENCES `bor` (`id`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
