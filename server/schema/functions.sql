SET TIME ZONE 'UTC';
CREATE EXTENSION pgcrypto;

-- Returns the current time as a UTC BIGINT
CREATE OR REPLACE FUNCTION now_utc(OUT _now_utc BIGINT) AS
$$
BEGIN
    SELECT extract(epoch FROM now()) INTO _now_utc;
END;
$$ LANGUAGE plpgsql;

-- Deletes inactive users that have not been activated 
CREATE OR REPLACE FUNCTION cleanup_inactive(
    age INTEGER DEFAULT 172800,  -- 48 hours
    OUT users INTEGER
) AS
$$
BEGIN
	  WITH
    _expired AS (
        DELETE FROM users
        WHERE
            NOT is_activated
            AND (now_utc() - created_time) > age
        RETURNING *
    ),
    _sessions AS (
        DElETE FROM sessions
        WHERE
            sess -> 'unconfirmed' ->> 'email' IN (SELECT email FROM _expired)
    )
    SELECT COUNT(*) INTO users FROM _expired;
END;
$$ LANGUAGE plpgsql;