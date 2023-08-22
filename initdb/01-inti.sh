set -e
export POSTGRES_PASSWORD=$POSTGRES_PASSWORD;
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
  CREATE USER $DB_USER WITH PASSWORD '$DB_PASS';
  ALTER USER $DB_USER CREATEDB;
  CREATE DATABASE $DB_NAME;
  \connect $DB_NAME $POSTGRES_USER
  GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;
  ALTER DATABASE $DB_NAME OWNER TO $DB_USER;
  \connect $DB_NAME $DB_USER
  BEGIN;
    CREATE TABLE users (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        is_verified BOOLEAN DEFAULT false,
        email_verification_token UUID,
        reset_token VARCHAR(255),
        reset_token_created_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );

    ALTER TABLE users ADD CONSTRAINT unique_username UNIQUE (username);
    ALTER TABLE users ADD CONSTRAINT unique_email UNIQUE (email);

  COMMIT;
EOSQL