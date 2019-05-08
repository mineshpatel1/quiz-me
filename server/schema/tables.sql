CREATE EXTENSION pgcrypto;

-- Express cookie sessionisation
DROP TABLE IF EXISTS sessions;
CREATE TABLE "sessions" (
    "sid" varchar NOT NULL COLLATE "default",
    "sess" json NOT NULL,
    "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);
ALTER TABLE "sessions" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

-- Users
DROP TABLE IF EXISTS users;
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR NOT NULL UNIQUE,
    name VARCHAR
);
CREATE INDEX users_id_idx ON users (id);
CREATE INDEX users_email_idx ON users (email);

-- User Authentication
DROP TABLE IF EXISTS user_auth;
CREATE TABLE IF NOT EXISTS user_auth (
    email VARCHAR PRIMARY KEY REFERENCES users(email) ON UPDATE RESTRICT ON DELETE CASCADE,
    password TEXT NOT NULL
);
CREATE INDEX user_auth_email_idx ON user_auth (email);
