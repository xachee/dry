-- phpMyAdmin SQL Dump
-- version 4.0.4.2
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Jul 05, 2017 at 04:16 PM
-- Server version: 5.6.13
-- PHP Version: 5.4.17

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `dry`
--

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `googleId` varchar(22) DEFAULT NULL,
  `accessToken` text,
  `refreshToken` text,
  `photos` text,
  `displayName` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `googleId` (`googleId`),
  UNIQUE KEY `users_googleId_unique` (`googleId`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=14 ;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `googleId`, `accessToken`, `refreshToken`, `photos`, `displayName`) VALUES
(1, '101123418999008327689', 'ya29.Glx-BKxLY5VyoYgeN0HbIsyEIShaO6EPR7TjpONP4nHT8tT3erT2XG5dK8rzT-LXFjW_aRCb-QY3y5eCYF5X82Pp5JcP_ORPlMcyCidWRYKsSiJsK_6FYfngLj4QSw', '1/db5T5f0BHflTvcNPgkOJCPti9Jb1vgQ0uBYGnuRapJk', 'https://lh3.googleusercontent.com/-PE4WynILznA/AAAAAAAAAAI/AAAAAAAAAFw/Sp-TjJ2Al2Q/photo.jpg?sz=50', 'Xach bi');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
