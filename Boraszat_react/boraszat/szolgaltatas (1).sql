-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Gép: mysqldb
-- Létrehozás ideje: 2026. Feb 03. 10:26
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

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `szolgaltatas`
--
ALTER TABLE `szolgaltatas`
  ADD PRIMARY KEY (`id`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `szolgaltatas`
--
ALTER TABLE `szolgaltatas`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
