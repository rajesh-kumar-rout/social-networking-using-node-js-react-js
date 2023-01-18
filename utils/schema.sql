CREATE TABLE socialUsers (
    `id` BIGINT(20) PRIMARY KEY AUTO_INCREMENT,
    `firtName` VARCHAR(20) NOT NULL,
    `lastName` VARCHAR(20),
    `bio` VARCHAR(30) NOT NULL,
    `email` VARCHAR(30) NOT NULL UNIQUE,
    `password` VARCHAR(100) NOT NULL,
    `work` VARCHAR(30),
    `school` VARCHAR(30),
    `college` VARCHAR(30),
    `currentCity` VARCHAR(30),
    `homeTown` VARCHAR(30),
    `relationship` VARCHAR(10),
    `gender` VARCHAR(10),
    `birthDate` DATE,
    `profileImageUrl` VARCHAR(100),
    `profileImageId` VARCHAR(100),
    `coverImageUrl` VARCHAR(100),
    `coverImageId` VARCHAR(100),
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
    `description` VARCHAR(255),
    `imageUrl` VARCHAR(100),
    `imageId` VARCHAR(100),
    `videoUrl` VARCHAR(100),
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

