-- phpMyAdmin SQL Dump
-- version 4.2.11
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Mar 27, 2015 at 02:21 
-- Server version: 5.6.21
-- PHP Version: 5.6.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `applications`
--
CREATE DATABASE IF NOT EXISTS `applications` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `applications`;

-- --------------------------------------------------------

--
-- Table structure for table `answer`
--

DROP TABLE IF EXISTS `answer`;
CREATE TABLE IF NOT EXISTS `answer` (
  `aId` int(11) NOT NULL,
  `fId` int(11) NOT NULL,
  `value` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `answer`
--

INSERT INTO `answer` (`aId`, `fId`, `value`) VALUES
(3, 62, 'jooooooooo'),
(3, 63, 'neeeeeee'),
(4, 63, 'jooooooooo'),
(4, 64, 'neeeeeee');

-- --------------------------------------------------------

--
-- Table structure for table `application`
--

DROP TABLE IF EXISTS `application`;
CREATE TABLE IF NOT EXISTS `application` (
`aId` int(11) NOT NULL,
  `time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `application`
--

INSERT INTO `application` (`aId`, `time`) VALUES
(3, '2015-03-27 12:53:52'),
(4, '2015-03-27 14:05:31');

-- --------------------------------------------------------

--
-- Table structure for table `attempts`
--

DROP TABLE IF EXISTS `attempts`;
CREATE TABLE IF NOT EXISTS `attempts` (
`id` int(11) NOT NULL,
  `ip` varchar(39) NOT NULL,
  `count` int(11) NOT NULL,
  `expiredate` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `field`
--

DROP TABLE IF EXISTS `field`;
CREATE TABLE IF NOT EXISTS `field` (
`fId` int(11) NOT NULL,
  `type` varchar(50) NOT NULL,
  `title` varchar(255) NOT NULL,
  `placeholder` varchar(255) NOT NULL,
  `rank` int(11) NOT NULL,
  `is_required` tinyint(1) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=72 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `field`
--

INSERT INTO `field` (`fId`, `type`, `title`, `placeholder`, `rank`, `is_required`) VALUES
(62, 'Textzeile', 'Vorname', 'Forename', 5, 0),
(63, 'Textzeile', 'Nachname', 'Backname', 3, 0),
(64, 'Radiobutton', 'Hochschule', '', 1, 0),
(68, 'Dropdown', 'Lieblingsfarbe', '', 4, 0),
(69, 'Textzeile', 'Alter', '12', 6, 0),
(71, 'Textzeile', 'Geburtsort', 'a', 6, 1);

-- --------------------------------------------------------

--
-- Table structure for table `member`
--

DROP TABLE IF EXISTS `member`;
CREATE TABLE IF NOT EXISTS `member` (
`mId` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `salt` varchar(22) NOT NULL,
  `admin` tinyint(1) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `member`
--

INSERT INTO `member` (`mId`, `name`, `password`, `salt`, `admin`) VALUES
(3, 'c', '$2y$10$Pi.nCjxa/iuIGcFh9xSQYO1TXUV.tK1BvASrfZdmOIwgTsFLQnVia', 'Pi.nCjxa/iuIGcFh9xSQYO', 1),
(4, 'a', '$2y$10$ZL.FAhx0j1su3ZLBS9/75OIocCK4VnxAUX7.o4jafYevwUFQrFH4m', 'ZL.FAhx0j1su3ZLBS9/75P', 0);

-- --------------------------------------------------------

--
-- Table structure for table `option`
--

DROP TABLE IF EXISTS `option`;
CREATE TABLE IF NOT EXISTS `option` (
  `fId` int(11) NOT NULL,
  `type` varchar(50) NOT NULL,
  `value` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `option`
--

INSERT INTO `option` (`fId`, `type`, `value`) VALUES
(64, 'option', 'WWU'),
(64, 'option', 'FH'),
(68, 'option', 'Schwarz');

-- --------------------------------------------------------

--
-- Table structure for table `question`
--

DROP TABLE IF EXISTS `question`;
CREATE TABLE IF NOT EXISTS `question` (
`qId` int(11) NOT NULL,
  `mId` int(11) NOT NULL,
  `aId` int(11) NOT NULL,
  `value` text NOT NULL,
  `time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `question`
--

INSERT INTO `question` (`qId`, `mId`, `aId`, `value`, `time`) VALUES
(2, 3, 3, 'wo denn jetzt', '2015-03-27 13:42:00');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
CREATE TABLE IF NOT EXISTS `sessions` (
`id` int(11) NOT NULL,
  `uid` int(11) NOT NULL,
  `hash` varchar(40) NOT NULL,
  `expiredate` datetime NOT NULL,
  `ip` varchar(39) NOT NULL,
  `agent` varchar(200) NOT NULL,
  `cookie_crc` varchar(40) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `vote`
--

DROP TABLE IF EXISTS `vote`;
CREATE TABLE IF NOT EXISTS `vote` (
  `mid` int(11) NOT NULL,
  `aId` int(11) NOT NULL,
  `value` enum('pro','con','neutral') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `vote`
--

INSERT INTO `vote` (`mid`, `aId`, `value`) VALUES
(4, 3, 'pro'),
(3, 4, 'pro'),
(3, 3, 'pro');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `answer`
--
ALTER TABLE `answer`
 ADD KEY `aId` (`aId`), ADD KEY `fId` (`fId`);

--
-- Indexes for table `application`
--
ALTER TABLE `application`
 ADD PRIMARY KEY (`aId`);

--
-- Indexes for table `attempts`
--
ALTER TABLE `attempts`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `field`
--
ALTER TABLE `field`
 ADD PRIMARY KEY (`fId`);

--
-- Indexes for table `member`
--
ALTER TABLE `member`
 ADD PRIMARY KEY (`mId`);

--
-- Indexes for table `option`
--
ALTER TABLE `option`
 ADD KEY `fId` (`fId`);

--
-- Indexes for table `question`
--
ALTER TABLE `question`
 ADD PRIMARY KEY (`qId`), ADD KEY `aId` (`aId`), ADD KEY `mId` (`mId`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `vote`
--
ALTER TABLE `vote`
 ADD KEY `mid` (`mid`), ADD KEY `aId` (`aId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `application`
--
ALTER TABLE `application`
MODIFY `aId` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT for table `attempts`
--
ALTER TABLE `attempts`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `field`
--
ALTER TABLE `field`
MODIFY `fId` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=72;
--
-- AUTO_INCREMENT for table `member`
--
ALTER TABLE `member`
MODIFY `mId` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=6;
--
-- AUTO_INCREMENT for table `question`
--
ALTER TABLE `question`
MODIFY `qId` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `sessions`
--
ALTER TABLE `sessions`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=37;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `answer`
--
ALTER TABLE `answer`
ADD CONSTRAINT `answer_ibfk_1` FOREIGN KEY (`aId`) REFERENCES `application` (`aId`) ON DELETE CASCADE ON UPDATE CASCADE,
ADD CONSTRAINT `answer_ibfk_2` FOREIGN KEY (`fId`) REFERENCES `field` (`fId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `option`
--
ALTER TABLE `option`
ADD CONSTRAINT `option_ibfk_1` FOREIGN KEY (`fId`) REFERENCES `field` (`fId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `question`
--
ALTER TABLE `question`
ADD CONSTRAINT `question_ibfk_1` FOREIGN KEY (`mId`) REFERENCES `member` (`mId`) ON DELETE CASCADE ON UPDATE CASCADE,
ADD CONSTRAINT `question_ibfk_2` FOREIGN KEY (`aId`) REFERENCES `application` (`aId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `vote`
--
ALTER TABLE `vote`
ADD CONSTRAINT `vote_ibfk_1` FOREIGN KEY (`mid`) REFERENCES `member` (`mId`) ON DELETE CASCADE ON UPDATE CASCADE,
ADD CONSTRAINT `vote_ibfk_2` FOREIGN KEY (`aId`) REFERENCES `application` (`aId`) ON DELETE CASCADE ON UPDATE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
