-- Express cookie sessionisation
DROP TABLE IF EXISTS sessions;
CREATE TABLE "sessions" (
    "sid" VARCHAR NOT NULL COLLATE "default",
    "sess" JSON NOT NULL,
    "expire" TIMESTAMP(6) NOT NULL
)
WITH (OIDS=FALSE);
ALTER TABLE "sessions" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

-- Drops
DROP TABLE IF EXISTS confirm_tokens;
DROP TABLE IF EXISTS user_auth;
DROP TABLE IF EXISTS users;

-- Users
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR NOT NULL UNIQUE,
    name VARCHAR,
    is_activated BOOLEAN DEFAULT FALSE,
    created_time BIGINT
);
CREATE INDEX users_id_idx ON users (id);
CREATE INDEX users_email_idx ON users (email);

-- User Authentication
CREATE TABLE IF NOT EXISTS user_auth (
    email VARCHAR PRIMARY KEY REFERENCES users(email) ON UPDATE RESTRICT ON DELETE CASCADE,
    password TEXT NOT NULL
);
CREATE INDEX user_auth_email_idx ON user_auth (email);

-- Email Confirmation Tokens
CREATE TABLE IF NOT EXISTS confirm_tokens (
    token VARCHAR PRIMARY KEY,
    email VARCHAR NOT NULL UNIQUE REFERENCES users(email) ON UPDATE RESTRICT ON DELETE CASCADE,
    expiry_time BIGINT NOT NULL
);
CREATE INDEX confirm_tokens_email_idx ON confirm_tokens (email);
