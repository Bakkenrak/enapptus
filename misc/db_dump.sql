-- phpMyAdmin SQL Dump
-- version 4.2.11
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Mar 26, 2015 at 08:04 
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

-- --------------------------------------------------------

--
-- Table structure for table `answer`
--

CREATE TABLE IF NOT EXISTS `answer` (
  `aId` int(11) NOT NULL,
  `fId` int(11) NOT NULL,
  `value` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `application`
--

CREATE TABLE IF NOT EXISTS `application` (
`aId` int(11) NOT NULL,
  `time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `application`
--

INSERT INTO `application` (`aId`, `time`) VALUES
(1, '2015-03-13 16:51:47');

-- --------------------------------------------------------

--
-- Table structure for table `attempts`
--

CREATE TABLE IF NOT EXISTS `attempts` (
`id` int(11) NOT NULL,
  `ip` varchar(39) NOT NULL,
  `count` int(11) NOT NULL,
  `expiredate` datetime NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `field`
--

CREATE TABLE IF NOT EXISTS `field` (
`fId` int(11) NOT NULL,
  `type` varchar(50) NOT NULL,
  `title` varchar(255) NOT NULL,
  `placeholder` varchar(255) NOT NULL,
  `rank` int(11) NOT NULL,
  `is_required` tinyint(1) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=71 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `field`
--

INSERT INTO `field` (`fId`, `type`, `title`, `placeholder`, `rank`, `is_required`) VALUES
(62, 'Textzeile', 'Vorname', 'Forename', 4, 0),
(63, 'Textzeile', 'Nachname', 'Backname', 6, 0),
(64, 'Radiobutton', 'Hochschule', '', 1, 0),
(68, 'Dropdown', 'Lieblingsfarbe', '', 3, 0),
(69, 'Textzeile', 'Alter', '12', 5, 0),
(70, 'Textzeile', 'asdsad', 'Platzhalter', 5, 0);

-- --------------------------------------------------------

--
-- Table structure for table `member`
--

CREATE TABLE IF NOT EXISTS `member` (
`mId` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `salt` varchar(22) NOT NULL,
  `admin` tinyint(1) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `member`
--

INSERT INTO `member` (`mId`, `name`, `password`, `salt`, `admin`) VALUES
(3, 'c', '$2y$10$FYf5E5jg8VqLemfXeMxDu.db/xzkyDYi.Rc8mMQIiuXs7.eiTuFD2', 'FYf5E5jg8VqLemfXeMxDuM', 1),
(4, 'a', '$2y$10$ZL.FAhx0j1su3ZLBS9/75OIocCK4VnxAUX7.o4jafYevwUFQrFH4m', 'ZL.FAhx0j1su3ZLBS9/75P', 1);

-- --------------------------------------------------------

--
-- Table structure for table `option`
--

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

CREATE TABLE IF NOT EXISTS `question` (
  `mId` int(11) NOT NULL,
  `aId` int(11) NOT NULL,
  `value` text NOT NULL,
  `time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE IF NOT EXISTS `sessions` (
`id` int(11) NOT NULL,
  `uid` int(11) NOT NULL,
  `hash` varchar(40) NOT NULL,
  `expiredate` datetime NOT NULL,
  `ip` varchar(39) NOT NULL,
  `agent` varchar(200) NOT NULL,
  `cookie_crc` varchar(40) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL,
  `username` varchar(30) DEFAULT NULL,
  `password` varchar(60) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `salt` varchar(22) DEFAULT NULL,
  `isactive` tinyint(1) NOT NULL DEFAULT '0',
  `dt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `email`, `salt`, `isactive`, `dt`) VALUES
(1, 'christian', '$2y$10$E69jNqeoIj1UY2gzk466XOuVibYToIAlMCFePIYEzJMEed6RXmTcC', 'c@h.de', 'E69jNqeoIj1UY2gzk466Xb', 1, '2015-03-24 16:19:35');

-- --------------------------------------------------------

--
-- Table structure for table `vote`
--

CREATE TABLE IF NOT EXISTS `vote` (
  `mid` int(11) NOT NULL,
  `aId` int(11) NOT NULL,
  `value` enum('pro','con','neutral') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

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
 ADD KEY `aId` (`aId`), ADD KEY `mId` (`mId`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
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
MODIFY `aId` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `attempts`
--
ALTER TABLE `attempts`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT for table `field`
--
ALTER TABLE `field`
MODIFY `fId` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=71;
--
-- AUTO_INCREMENT for table `member`
--
ALTER TABLE `member`
MODIFY `mId` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT for table `sessions`
--
ALTER TABLE `sessions`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=16;
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
