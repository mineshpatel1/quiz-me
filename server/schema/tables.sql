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
    name    VARCHAR
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
    question    VARCHAR NOT NULL UNIQUE,
    options     VARCHAR[] NOT NULL,
    answer      VARCHAR NOT NULL,
    category_id SMALLINT NOT NULL REFERENCES categories(id)
);

-- Users
DROP TABLE IF EXISTS game_requests;
DROP TABLE IF EXISTS games;
DROP TABLE IF EXISTS forgotten_password_tokens;
DROP TABLE IF EXISTS confirm_tokens;
DROP TABLE IF EXISTS user_friends;
DROP TABLE IF EXISTS user_auth;
DROP TABLE IF EXISTS users;

CREATE TABLE IF NOT EXISTS users (
    id              SERIAL PRIMARY KEY,
    email           VARCHAR NOT NULL UNIQUE,
    name            VARCHAR,
    is_activated    BOOLEAN DEFAULT FALSE,
    fingerprint_key VARCHAR,
    push_tokens     VARCHAR[],
    push_enabled    BOOLEAN DEFAULT TRUE,
    created_time    BIGINT
);
CREATE INDEX users_id_idx ON users (id);
CREATE INDEX users_email_idx ON users (email);

-- User Authentication
CREATE TABLE IF NOT EXISTS user_auth (
    email       VARCHAR PRIMARY KEY REFERENCES users(email) ON UPDATE RESTRICT ON DELETE CASCADE,
    password    TEXT NOT NULL
);
CREATE INDEX user_auth_email_idx ON user_auth (email);

-- Email Confirmation Tokens
CREATE TABLE IF NOT EXISTS confirm_tokens (
    token       VARCHAR PRIMARY KEY,
    email       VARCHAR NOT NULL UNIQUE REFERENCES users(email) ON UPDATE RESTRICT ON DELETE CASCADE,
    expiry_time BIGINT NOT NULL
);
CREATE INDEX confirm_tokens_email_idx ON confirm_tokens (email);

-- Forgotten Password Tokens
CREATE TABLE IF NOT EXISTS forgotten_password_tokens (
    email       VARCHAR PRIMARY KEY REFERENCES users(email) ON UPDATE RESTRICT ON DELETE CASCADE,
    token       VARCHAR NOT NULL UNIQUE,
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

CREATE TABLE IF NOT EXISTS games (
    id                      SERIAL PRIMARY KEY,
    player_1_id             BIGINT NOT NULL REFERENCES users(id) ON UPDATE RESTRICT ON DELETE CASCADE,
    player_2_id             BIGINT NOT NULL REFERENCES users(id) ON UPDATE RESTRICT ON DELETE CASCADE,
    settings                JSON NOT NULL,
    player_1_answers        VARCHAR[] DEFAULT ARRAY[]::VARCHAR[],
    player_2_answers        VARCHAR[] DEFAULT ARRAY[]::VARCHAR[],
    winner_id               BIGINT,
    question_ids            BIGINT[],
    is_complete             BOOLEAN DEFAULT FALSE,
    requested_time          BIGINT,
    start_time              BIGINT,
    end_time                BIGINT   
);

CREATE TABLE IF NOT EXISTS game_requests (
    player_1_id     BIGINT NOT NULL REFERENCES users(id) ON UPDATE RESTRICT ON DELETE CASCADE,
    player_2_id     BIGINT NOT NULL,
    settings		JSON NOT NULL,
    expiry_time     BIGINT NOT NULL,
    is_confirmed    BOOLEAN DEFAULT FALSE
);
CREATE INDEX game_requests_player_1_id_idx ON game_requests (player_1_id);
CREATE INDEX game_requests_player_2_id_idx ON game_requests (player_2_id);
ALTER TABLE game_requests ADD CONSTRAINT game_requests_assoc_key UNIQUE (player_1_id, player_2_id);
