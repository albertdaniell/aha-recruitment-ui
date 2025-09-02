CREATE TABLE `tblsusublocations` (
  `sublocation_id` int unsigned NOT NULL AUTO_INCREMENT,
  `location_id` int unsigned NOT NULL,
  `sublocation_code` char(10) NOT NULL,
  `sublocation` varchar(255) NOT NULL,
  `area` double(30,10) DEFAULT NULL,
  `date_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int unsigned DEFAULT NULL,
  `date_edited` date DEFAULT NULL,
  `edited_by` int unsigned DEFAULT NULL,
  PRIMARY KEY (`sublocation_id`),
  UNIQUE KEY `uniquecampcode` (`sublocation_code`),
  UNIQUE KEY `uniquecampname` (`location_id`,`sublocation`),
  KEY `FK_tblsuagricamps_blocks` (`location_id`),
  KEY `created_by` (`created_by`),
  KEY `date_created` (`date_created`),
  CONSTRAINT `FK_tblsusublocations_location` FOREIGN KEY (`location_id`) REFERENCES `tblsulocations` (`location_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4294967295 DEFAULT CHARSET=utf8mb3;

CREATE TABLE `tblsulocations` (
  `location_id` int unsigned NOT NULL AUTO_INCREMENT,
  `subcounty_id` int unsigned NOT NULL,
  `division_id` int unsigned NOT NULL,
  `location_code` char(10) NOT NULL,
  `location` varchar(255) NOT NULL,
  `area` double(30,10) DEFAULT NULL,
  `date_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int unsigned DEFAULT NULL,
  `date_edited` date DEFAULT NULL,
  `edited_by` int unsigned DEFAULT NULL,
  PRIMARY KEY (`location_id`),
  UNIQUE KEY `uniqueagriblock` (`location_code`),
  UNIQUE KEY `uniqueagriblockname` (`subcounty_id`,`location`,`division_id`),
  KEY `FK_tblsuagriblocls_district` (`subcounty_id`),
  KEY `created_by` (`created_by`),
  KEY `date_created` (`date_created`),
  KEY `FK_tblsulocations` (`division_id`),
  CONSTRAINT `FK_tblsulocations` FOREIGN KEY (`division_id`) REFERENCES `tblsudivision` (`division_id`),
  CONSTRAINT `FK_tblsulocations_subcounty` FOREIGN KEY (`subcounty_id`) REFERENCES `tblsusubcounties` (`subcounty_id`)
) ENGINE=InnoDB AUTO_INCREMENT=45020204 DEFAULT CHARSET=utf8mb3;

CREATE TABLE `tblsudivision` (
  `division_id` int unsigned NOT NULL AUTO_INCREMENT,
  `county_id` int unsigned NOT NULL,
  `division_code` char(10) NOT NULL,
  `division` varchar(255) NOT NULL,
  `area` double(30,10) DEFAULT NULL,
  `date_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int unsigned DEFAULT NULL,
  `date_edited` date DEFAULT NULL,
  `edited_by` int unsigned DEFAULT NULL,
  PRIMARY KEY (`division_id`),
  UNIQUE KEY `uniquedistrictcode` (`division_code`),
  UNIQUE KEY `uniquedistrictname` (`division`,`county_id`),
  KEY `FK_tblsudistricts_province` (`county_id`),
  KEY `created_by` (`created_by`),
  KEY `date_created` (`date_created`),
  CONSTRAINT `FK_tblsudivision_county` FOREIGN KEY (`county_id`) REFERENCES `tblsucounties` (`county_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1007 DEFAULT CHARSET=utf8mb3;

CREATE TABLE `tblsuwards` (
  `ward_id` int unsigned NOT NULL AUTO_INCREMENT,
  `subcounty_id` int unsigned NOT NULL,
  `constituency_id` int unsigned DEFAULT NULL,
  `ward_code` char(20) NOT NULL,
  `ward` varchar(255) NOT NULL,
  `area` double(30,10) DEFAULT NULL,
  `date_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int unsigned DEFAULT NULL,
  PRIMARY KEY (`ward_id`),
  UNIQUE KEY `uniquewardcode` (`ward_code`),
  UNIQUE KEY `uniquedistrictward` (`subcounty_id`,`ward`),
  KEY `FK_tblsuward_district` (`subcounty_id`),
  KEY `created_by` (`created_by`),
  KEY `date_created` (`date_created`),
  KEY `FK_tblsuwards_constituency` (`constituency_id`),
  CONSTRAINT `FK_tblsuwards_constituency` FOREIGN KEY (`constituency_id`) REFERENCES `tblsuconstituency` (`constituency_id`),
  CONSTRAINT `FK_tblsuwards_subcounty` FOREIGN KEY (`subcounty_id`) REFERENCES `tblsusubcounties` (`subcounty_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1471 DEFAULT CHARSET=utf8mb3;

CREATE TABLE `tblsuconstituency` (
  `constituency_id` int unsigned NOT NULL AUTO_INCREMENT,
  `county_id` int unsigned NOT NULL,
  `const_code` char(20) NOT NULL,
  `constituency` varchar(255) DEFAULT NULL,
  `area` double(30,10) DEFAULT NULL,
  `date_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int unsigned DEFAULT NULL,
  PRIMARY KEY (`constituency_id`),
  UNIQUE KEY `uniqueconstituencycode` (`const_code`),
  UNIQUE KEY `niquedistrictconstituency` (`constituency`),
  KEY `created_by` (`created_by`),
  KEY `date_created` (`date_created`),
  KEY `FK_tblsuconstituency_province` (`county_id`),
  CONSTRAINT `FK_tblsuconstituency_province` FOREIGN KEY (`county_id`) REFERENCES `tblsucounties` (`county_id`)
) ENGINE=InnoDB AUTO_INCREMENT=291 DEFAULT CHARSET=utf8mb3;

CREATE TABLE `tblsusubcounties` (
  `subcounty_id` int unsigned NOT NULL AUTO_INCREMENT,
  `county_id` int unsigned NOT NULL,
  `subcounty_code` char(10) NOT NULL,
  `subcounty` varchar(255) NOT NULL,
  `area` double(30,10) DEFAULT NULL,
  `date_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int unsigned DEFAULT NULL,
  `date_edited` date DEFAULT NULL,
  `edited_by` int unsigned DEFAULT NULL,
  PRIMARY KEY (`subcounty_id`),
  UNIQUE KEY `uniquedistrictcode` (`subcounty_code`),
  UNIQUE KEY `uniquedistrictname` (`subcounty`),
  KEY `FK_tblsudistricts_province` (`county_id`),
  KEY `created_by` (`created_by`),
  KEY `date_created` (`date_created`),
  CONSTRAINT `FK_tblsusubcounties_county` FOREIGN KEY (`county_id`) REFERENCES `tblsucounties` (`county_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3510 DEFAULT CHARSET=utf8mb3;

CREATE TABLE `tblsucounties` (
  `county_id` int unsigned NOT NULL AUTO_INCREMENT,
  `county_code` char(10) NOT NULL,
  `county` varchar(255) NOT NULL,
  `area` double(30,10) DEFAULT NULL,
  `date_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int unsigned DEFAULT NULL,
  PRIMARY KEY (`county_id`),
  UNIQUE KEY `uniqueprovincecode` (`county_code`),
  UNIQUE KEY `uniqueprovincename` (`county`),
  KEY `created_by` (`created_by`),
  KEY `date_created` (`date_created`)
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=utf8mb3;
