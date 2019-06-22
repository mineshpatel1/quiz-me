-- Express cookie sessionisation
DROP TABLE IF EXISTS sessions;
CREATE TABLE "sessions" (
    "sid" VARCHAR NOT NULL COLLATE "default",
    "sess" JSON NOT NULL,
    "expire" TIMESTAMP(6) NOT NULL
)
WITH (OIDS=FALSE);
ALTER TABLE "sessions" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

-- Question Library
DROP TABLE IF EXISTS questions;
DROP TABLE IF EXISTS categories;

CREATE TABLE categories (
    id      SMALLINT PRIMARY KEY,
    name    VARCHAR(50)
);
INSERT INTO categories (id, name) VALUES
    (1,  'General Knowledge'),
    (2,  'Sports'),
    (3,  'Science'),
    (4,  'Geography'),
    (5,  'History'),
    (6,  'Film'),
    (7,  'Music'),
    (8,  'Literature'),
    (9,  'People & Quotes'),
    (10, 'Faith & Mythology'),
    (11, 'TV'),
    (12, 'Animals'),
    (13, 'Puzzle'),
    (14, 'Art'),
    (15, 'Politics'),
    (16, 'Vehicles');

CREATE TABLE IF NOT EXISTS questions (
    id          BIGINT PRIMARY KEY,
    question    VARCHAR(1000) NOT NULL UNIQUE,
    options     VARCHAR(500)[] NOT NULL,
    answer      VARCHAR(500) NOT NULL,
    category_id SMALLINT NOT NULL REFERENCES categories(id)
);

-- Users
DROP TABLE IF EXISTS forgotten_password_tokens;
DROP TABLE IF EXISTS confirm_tokens;
DROP TABLE IF EXISTS user_friends;
DROP TABLE IF EXISTS user_auth;
DROP TABLE IF EXISTS users;

CREATE TABLE IF NOT EXISTS users (
    id              SERIAL PRIMARY KEY,
    email           VARCHAR(255) NOT NULL UNIQUE,
    name            VARCHAR(255),
    is_activated    BOOLEAN DEFAULT FALSE,
    fingerprint_key VARCHAR(1000),
    push_tokens     VARCHAR(1000)[],
    push_enabled    BOOLEAN DEFAULT TRUE,
    created_time    BIGINT
);
CREATE INDEX users_id_idx ON users (id);
CREATE INDEX users_email_idx ON users (email);

-- User Authentication
CREATE TABLE IF NOT EXISTS user_auth (
    email       VARCHAR(255) PRIMARY KEY REFERENCES users(email) ON UPDATE RESTRICT ON DELETE CASCADE,
    password    TEXT NOT NULL
);
CREATE INDEX user_auth_email_idx ON user_auth (email);

-- Email Confirmation Tokens
CREATE TABLE IF NOT EXISTS confirm_tokens (
    token       VARCHAR(10) PRIMARY KEY,
    email       VARCHAR(255) NOT NULL UNIQUE REFERENCES users(email) ON UPDATE RESTRICT ON DELETE CASCADE,
    expiry_time BIGINT NOT NULL
);
CREATE INDEX confirm_tokens_email_idx ON confirm_tokens (email);

-- Forgotten Password Tokens
CREATE TABLE IF NOT EXISTS forgotten_password_tokens (
    email       VARCHAR(255) PRIMARY KEY REFERENCES users(email) ON UPDATE RESTRICT ON DELETE CASCADE,
    token       VARCHAR(10) NOT NULL UNIQUE,
    expiry_time BIGINT NOT NULL
);
CREATE INDEX forgotten_password_tokens_email_idx ON forgotten_password_tokens (email);

-- User Friend Assoc
CREATE TABLE IF NOT EXISTS user_friends (
    user_id         BIGINT NOT NULL REFERENCES users(id) ON UPDATE RESTRICT ON DELETE CASCADE,
    friend_id       BIGINT NOT NULL REFERENCES users(id) ON UPDATE RESTRICT ON DELETE CASCADE,
    is_confirmed    BOOLEAN
);
CREATE INDEX user_friends_user_id_idx ON user_friends (user_id);
CREATE INDEX user_friends_friend_id_idx ON user_friends (friend_id);
ALTER TABLE user_friends ADD CONSTRAINT user_friends_assoc_key UNIQUE (user_id, friend_id);

