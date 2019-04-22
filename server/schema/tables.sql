DROP TABLE IF EXISTS session;
CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
        "sess" json NOT NULL,
        "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);
ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

DROP TABLE IF EXISTS users;
CREATE TABLE IF NOT EXISTS users (
 	id SERIAL PRIMARY KEY,
 	email VARCHAR NOT NULL UNIQUE,
	name VARCHAR
);
CREATE INDEX users_id_idx ON users (id);