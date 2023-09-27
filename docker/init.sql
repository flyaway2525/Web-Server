-- init.sql
CREATE DATABASE IF NOT EXISTS sampleDB;
USE sampleDB;
CREATE TABLE IF NOT EXISTS sampleTable (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255)
);

-- データベースの作成
CREATE DATABASE IF NOT EXISTS chat_app_db;

-- データベースを選択
USE chat_app_db;

-- users テーブルの作成
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255) NOT NULL,
    profile VARCHAR(255),
    details VARCHAR(255),
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    deleted_at DATETIME
);

-- messages テーブルの作成
CREATE TABLE IF NOT EXISTS messages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    channel_id INT NOT NULL,
    user_id INT NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    deleted_at DATETIME,
--    FOREIGN KEY (channel_id) REFERENCES channels(id), -- channelテーブルは別途作成予定
    FOREIGN KEY (user_id) REFERENCES users(id)
);