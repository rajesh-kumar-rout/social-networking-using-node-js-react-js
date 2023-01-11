CREATE TABLE social_users (
    `id` BIGINT(20) PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(30) NOT NULL,
    `email` VARCHAR(30) NOT NULL UNIQUE,
    `password` VARCHAR(100) NOT NULL,
    `profileImgUrl` VARCHAR(100),
    `profileImgId` VARCHAR(100),
    `coverImgUrl` VARCHAR(100),
    `coverImgId` VARCHAR(100),
    `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE social_posts (
    `id` BIGINT(20) PRIMARY KEY AUTO_INCREMENT,
    `desc` VARCHAR(255),
    `imgUrl` VARCHAR(100),
    `imgId` VARCHAR(100),
    `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `userId` BIGINT(20),
    FOREIGN KEY (`userId`) REFERENCES `social_users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE social_comments (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `comment` VARCHAR(255),
    `userId` BIGINT(20),
    `postId` BIGINT(20),
    `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`userId`) REFERENCES `social_users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (`postId`) REFERENCES `social_posts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE social_likes (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `userId` BIGINT(20),
    `postId` BIGINT(20),
    FOREIGN KEY (`userId`) REFERENCES `social_users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (`postId`) REFERENCES `social_posts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE social_followers (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `followerId` BIGINT(20),
    `followingId` BIGINT(20),
    FOREIGN KEY (`followerId`) REFERENCES `social_users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (`followingId`) REFERENCES `social_users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
);

