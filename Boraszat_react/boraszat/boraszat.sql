-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Gép: mysqldb
-- Létrehozás ideje: 2026. Feb 03. 10:27
-- Kiszolgáló verziója: 8.0.45
-- PHP verzió: 8.3.30

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
  `id` int NOT NULL,
  `bor_szin_id` int NOT NULL,
  `nev` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_hungarian_ci NOT NULL,
  `evjarat` int NOT NULL,
  `ar` int NOT NULL,
  `kiszereles_id` int NOT NULL DEFAULT '1',
  `keszlet` int NOT NULL DEFAULT '0',
  `alkoholfok` decimal(4,2) DEFAULT NULL,
  `leiras` text CHARACTER SET utf8mb4 COLLATE utf8mb4_hungarian_ci,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- A tábla adatainak kiíratása `bor`
--

INSERT INTO `bor` (`id`, `bor_szin_id`, `nev`, `evjarat`, `ar`, `kiszereles_id`, `keszlet`, `alkoholfok`, `leiras`, `created_at`) VALUES
(1, 1, 'Badacsonyi Kéknyelvű', 2022, 4500, 1, 7, 12.50, 'Hungaricum, vulkanikus talajról származó elegáns fehérbor.', '2026-01-27 10:50:43'),
(2, 1, 'Badacsonyi Olaszrizling', 2023, 2800, 3, 119, 11.50, 'Mandulás utóízű, friss és üde klasszikus Badacsonyi bor.', '2026-01-27 10:50:43'),
(3, 1, 'Badacsonyi Szürkebarát', 2022, 3200, 1, 85, 13.00, 'Testes, krémes textúrájú fehérbor, az aszú közeli élményért.', '2026-01-27 10:50:43'),
(4, 1, 'Rózsakő', 2022, 3600, 5, 40, 12.00, 'A Kéknyelvű és a Budai Zöld keresztezéséből született ritkaság.', '2026-01-27 10:50:43'),
(5, 1, 'Ottonel Muskotály', 2023, 2900, 1, 60, 11.00, 'Illatos, intenzív virágos jegyekkel rendelkező könnyed fehérbor.', '2026-01-27 10:50:43'),
(6, 3, 'Badacsonyi Pinot Noir Rosé', 2023, 2600, 1, 100, 12.00, 'Epres illatú, ropogós savakkal rendelkező nyári frissítő.', '2026-01-27 10:50:43'),
(7, 2, 'Badacsonyi Cabernet Sauvignon', 2021, 4800, 1, 35, 14.00, 'Mélyvörös színű, erdei gyümölcsös jegyekkel bíró testes vörösbor.', '2026-01-27 10:50:43'),
(8, 2, 'Badacsonyi Kékfrankos', 2022, 3400, 1, 70, 13.00, 'Fűszeres karakterű, gyümölcsös vörösbor a bazaltos lejtőkről.', '2026-01-27 10:50:43'),
(22, 2, 'Lesencei Zsiványok', 2016, 4000, 1, 65, 12.00, 'A jó Laci betyár tiszteletére készült, az igaz zsiványoknak.', '2026-02-03 09:19:22'),
(23, 3, 'Lecsó Lecsó', 2025, 3500, 1, 80, 15.00, 'Paprikasó, szó ami szó nekem kedvencem a lecsó.\nEgy kis eszem iszom, az a paradicsom,\na jó kedvem áztatom.', '2026-02-03 09:20:06');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `bor_szin`
--

CREATE TABLE `bor_szin` (
  `id` int NOT NULL,
  `nev` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL
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
  `id` int NOT NULL,
  `rendeles_id` int NOT NULL,
  `fizetesi_mod` enum('KARTYA','UTALAS','UTANVET') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `statusz` enum('INIT','SIKERES','SIKERTELEN') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'INIT',
  `tranzakcio_azon` varchar(80) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `osszeg` int NOT NULL,
  `datum` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
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
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `szolgaltatas_id` int NOT NULL,
  `datum` date DEFAULT NULL,
  `idotartam` time DEFAULT NULL,
  `letszam` int NOT NULL DEFAULT '1',
  `statusz` enum('PENDING','CONFIRMED','CANCELLED') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'PENDING',
  `foglalas_datuma` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `megjegyzes` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `osszeg` int NOT NULL DEFAULT '0',
  `extra_info` varchar(60) COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `kiszereles`
--

CREATE TABLE `kiszereles` (
  `id` int NOT NULL,
  `megnevezes` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_hungarian_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- A tábla adatainak kiíratása `kiszereles`
--

INSERT INTO `kiszereles` (`id`, `megnevezes`) VALUES
(1, '0.75L Palack'),
(2, '1.5L Magnum'),
(3, '2L Kanna'),
(4, '3L Bag-in-Box'),
(5, '0.75L + Díszdoboz');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `rendeles`
--

CREATE TABLE `rendeles` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `szaml_nev` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `szaml_orszag` varchar(60) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `szaml_irsz` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `szaml_varos` varchar(80) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `szaml_utca` varchar(120) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `szaml_hazszam` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `szall_nev` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `datum` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `statusz` enum('KOSAR','FELDOLGOZAS','FIZETVE','KISZALLITVA','TOROLVE') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'KOSAR',
  `szall_orszag` varchar(60) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `szall_irsz` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `szall_varos` varchar(80) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `szall_utca` varchar(120) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `szall_hazszam` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `szallitasi_dij` int NOT NULL DEFAULT '0',
  `vegosszeg` int NOT NULL DEFAULT '0',
  `megjegyzes` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `rendeles`
--

INSERT INTO `rendeles` (`id`, `user_id`, `szaml_nev`, `szaml_orszag`, `szaml_irsz`, `szaml_varos`, `szaml_utca`, `szaml_hazszam`, `szall_nev`, `datum`, `statusz`, `szall_orszag`, `szall_irsz`, `szall_varos`, `szall_utca`, `szall_hazszam`, `szallitasi_dij`, `vegosszeg`, `megjegyzes`) VALUES
(1, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-01-10 16:33:40', 'KOSAR', NULL, NULL, NULL, NULL, NULL, 1200, 0, NULL),
(2, 6, 'Szikla Szilárd', 'Magyarország', '8315', 'Gyenesdiás', 'Hunyadi János Utca', '22', NULL, '2026-01-30 17:22:45', 'FELDOLGOZAS', 'Magyarország', '8315', 'Gyenesdiás', 'Hunyadi János Utca', '22', 0, 10100, NULL),
(3, 6, 'Szikla Szilárd', 'Magyarország', '8315', 'Gyenesdiás', 'Hunyadi János Utca', '22', 'Szikla Szilárd', '2026-01-30 17:41:58', 'FELDOLGOZAS', 'Magyarország', '8315', 'Gyenesdiás', 'Hunyadi János Utca', '22', 0, 4500, NULL),
(4, 6, 'Szikla Szilárd', 'Magyarország', '8315', 'Gyenesdiás', 'Hunyadi János Utca', '22', 'Szikla Szilárd', '2026-01-30 17:44:36', 'FELDOLGOZAS', 'Magyarország', '8315', 'Gyenesdiás', 'Hunyadi János Utca', '22', 0, 9000, NULL),
(5, 6, 'Szikla Szilárd', 'Magyarország', '8315', 'Gyenesdiás', 'Hunyadi János Utca', '22', 'Szikla Szilárd', '2026-01-30 18:11:34', 'FELDOLGOZAS', 'Magyarország', '8315', 'Gyenesdiás', 'Hunyadi János Utca', '22', 0, 7300, NULL);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `rendeles_tetel`
--

CREATE TABLE `rendeles_tetel` (
  `id` int NOT NULL,
  `rendeles_id` int NOT NULL,
  `bor_id` int NOT NULL,
  `mennyiseg` int NOT NULL,
  `egysegar` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `rendeles_tetel`
--

INSERT INTO `rendeles_tetel` (`id`, `rendeles_id`, `bor_id`, `mennyiseg`, `egysegar`) VALUES
(5, 2, 1, 1, 4500),
(6, 2, 2, 2, 2800),
(7, 3, 1, 1, 4500),
(8, 4, 1, 2, 4500),
(9, 5, 1, 1, 4500),
(10, 5, 2, 1, 2800);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `szolgaltatas`
--

CREATE TABLE `szolgaltatas` (
  `id` int NOT NULL,
  `nev` varchar(120) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `kapacitas` int NOT NULL DEFAULT '1',
  `ar` int NOT NULL,
  `leiras` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `aktiv` tinyint(1) NOT NULL DEFAULT '1',
  `datum` date DEFAULT NULL,
  `idotartam` time DEFAULT NULL,
  `extra` varchar(60) COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `szolgaltatas`
--

INSERT INTO `szolgaltatas` (`id`, `nev`, `kapacitas`, `ar`, `leiras`, `aktiv`, `datum`, `idotartam`, `extra`) VALUES
(1, 'BORKOSTOLÁS', 15, 7500, 'Prémium vörösbor kóstoló', 1, '2026-03-15', '02:00:00', 'Sajttál mellékelve'),
(2, 'BORKOSTOLÁS', 10, 5500, 'Alapozó fehérbor válogatás', 1, '2026-03-20', '01:30:00', 'Pincevezetéssel'),
(3, 'BORKOSTOLÁS', 20, 9500, 'Húsvéti borkülönlegességek', 1, '2026-04-05', '03:00:00', 'Ajándék pohár');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `email` varchar(150) CHARACTER SET utf8mb3 COLLATE utf8mb3_hungarian_ci NOT NULL,
  `password_hash` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `role` enum('USER','ADMIN') CHARACTER SET utf8mb3 COLLATE utf8mb3_hungarian_ci NOT NULL DEFAULT 'USER',
  `nev` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_hungarian_ci NOT NULL,
  `telefonszam` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_hungarian_ci DEFAULT NULL,
  `orszag` varchar(60) CHARACTER SET utf8mb3 COLLATE utf8mb3_hungarian_ci NOT NULL DEFAULT 'Magyarország',
  `irsz` varchar(10) CHARACTER SET utf8mb3 COLLATE utf8mb3_hungarian_ci DEFAULT NULL,
  `varos` varchar(80) CHARACTER SET utf8mb3 COLLATE utf8mb3_hungarian_ci DEFAULT NULL,
  `utca` varchar(120) CHARACTER SET utf8mb3 COLLATE utf8mb3_hungarian_ci DEFAULT NULL,
  `hazszam` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_hungarian_ci DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_login` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `users`
--

INSERT INTO `users` (`id`, `email`, `password_hash`, `role`, `nev`, `telefonszam`, `orszag`, `irsz`, `varos`, `utca`, `hazszam`, `is_active`, `created_at`, `last_login`) VALUES
(1, 'teszt@bor.hu', 'teszt123', 'USER', 'Teszt Elek', '0612345678', 'Magyarország', NULL, NULL, NULL, NULL, 1, '2026-01-10 16:32:53', NULL),
(2, 'bencesinthavong@gmail.com', '$2b$10$oLF8hiELHvXbhrO6gWKIqO2UnwwxtWZm6KTjSLy6I6ptcg7kM02b6', 'USER', 'Sinthavong Bence', '06303216644', 'Magyarország', '8314', 'Vonyarcvashegy', 'Petőfi utca', '12', 1, '2026-01-21 21:26:54', NULL),
(3, 'gibszjakab900@gmail.com', '$2b$10$NH239kEgofclOgUGBwsMQOQw2ikp9NHpNEq6dOic7YAdeeS1x2iSi', 'USER', 'Zongora', '06 203222', 'Magyarország', '', '', '', '', 1, '2026-01-22 09:22:42', NULL),
(5, 'admin@gmail.com', '$2b$10$wEoWWETNHk9qGCdMN.Hu5.BjdsMTlrU/oJRQ71y2JaCUzLt.DgbQu', 'ADMIN', 'Admin', '06 2032221', 'Magyarország', '8360', 'Keszthely', 'Fő tér', '12', 1, '2026-01-27 10:13:51', NULL),
(6, 'szikla@gmail.com', '$2b$10$Epe5ByWs8xhA/ma3lzsLwukae5lsHfYHnfVZxa/ea905FhmxW1LXG', 'USER', 'Szikla Szilárd', '06203214444', 'Magyarország', '8315', 'Gyenesdiás', 'Hunyadi János Utca', '22', 1, '2026-01-30 17:19:24', NULL);

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
  ADD KEY `idx_bor_ar` (`ar`),
  ADD KEY `fk_bor_kiszereles` (`kiszereles_id`);

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
  ADD KEY `idx_foglalas_szolg` (`szolgaltatas_id`);

--
-- A tábla indexei `kiszereles`
--
ALTER TABLE `kiszereles`
  ADD PRIMARY KEY (`id`);

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
  ADD PRIMARY KEY (`id`);

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
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT a táblához `bor_szin`
--
ALTER TABLE `bor_szin`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT a táblához `fizetes`
--
ALTER TABLE `fizetes`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT a táblához `foglalas`
--
ALTER TABLE `foglalas`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT a táblához `kiszereles`
--
ALTER TABLE `kiszereles`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT a táblához `rendeles`
--
ALTER TABLE `rendeles`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT a táblához `rendeles_tetel`
--
ALTER TABLE `rendeles_tetel`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT a táblához `szolgaltatas`
--
ALTER TABLE `szolgaltatas`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT a táblához `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `bor`
--
ALTER TABLE `bor`
  ADD CONSTRAINT `bor_ibfk_1` FOREIGN KEY (`bor_szin_id`) REFERENCES `bor_szin` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_bor_kiszereles` FOREIGN KEY (`kiszereles_id`) REFERENCES `kiszereles` (`id`);

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
