CREATE TABLE socialUsers (
    `id` BIGINT(20) PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(30) NOT NULL,
    `email` VARCHAR(30) NOT NULL UNIQUE,
    `password` VARCHAR(100) NOT NULL,
    `work` VARCHAR(30) NOT NULL,
    `school` VARCHAR(40) NOT NULL,
    `college` VARCHAR(40) NOT NULL,
    `currentAddress` VARCHAR(30),
    `permanentAddress` VARCHAR(30),
    `relationship` VARCHAR(10),
    `gender` VARCHAR(10),
    `birthDate` DATE,
    `profileImgUrl` VARCHAR(100),
    `profileImgId` VARCHAR(100),
    `coverImgUrl` VARCHAR(100),
    `coverImgId` VARCHAR(100),
    `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE socialTokens (
    `id` BIGINT(20) PRIMARY KEY AUTO_INCREMENT,
    `userId` BIGINT(20) NOT NULL,
    `token` VARCHAR(100) NOT NULL UNIQUE,
    `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`userId`) REFERENCES `socialUsers`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE socialPosts (
    `id` BIGINT(20) PRIMARY KEY AUTO_INCREMENT,
    `desc` VARCHAR(255),
    `imgUrl` VARCHAR(100),
    `imgId` VARCHAR(100),
    `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `userId` BIGINT(20),
    FOREIGN KEY (`userId`) REFERENCES `socialUsers`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE socialComments (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `comment` VARCHAR(255),
    `userId` BIGINT(20),
    `postId` BIGINT(20),
    `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`userId`) REFERENCES `socialUsers`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (`postId`) REFERENCES `socialPosts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE socialLikes (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `userId` BIGINT(20),
    `postId` BIGINT(20),
    FOREIGN KEY (`userId`) REFERENCES `socialUsers`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (`postId`) REFERENCES `socialPosts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE socialFollowers (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `followerId` BIGINT(20),
    `followingId` BIGINT(20),
    FOREIGN KEY (`followerId`) REFERENCES `socialUsers`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (`followingId`) REFERENCES `socialUsers`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
);

