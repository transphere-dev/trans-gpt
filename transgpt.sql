-- Create users table with an emailverified column
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    emailverified BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

-- Create chat_sessions table
CREATE TABLE chat_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    last_active_at TIMESTAMP NOT NULL
);

-- Create custom ENUM type for sender
CREATE TYPE sender_enum AS ENUM ('user', 'ai');

-- Create chat_messages table
CREATE TABLE chat_messages (
    id SERIAL PRIMARY KEY,
    chat_session_id BIGINT NOT NULL REFERENCES chat_sessions(id),
    content TEXT NOT NULL,
    sender sender_enum NOT NULL,
    created_at TIMESTAMP NOT NULL,
    sender_id INTEGER,
    model VARCHAR(255),
    role VARCHAR(255)
);

-- Index for faster query performance on chat_messages
CREATE INDEX idx_chat_messages_chat_session_id ON chat_messages(chat_session_id);

-- Create glossaries table
CREATE TABLE glossaries (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    name VARCHAR(255) NOT NULL,
    language VARCHAR(10) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

-- Create source_terms table
CREATE TABLE source_terms (
    id SERIAL PRIMARY KEY,
    glossary_id INTEGER NOT NULL REFERENCES glossaries(id),
    term VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

-- Index for faster query performance on source_terms
CREATE INDEX idx_source_terms_glossary_id ON source_terms(glossary_id);

-- Create target_terms table
CREATE TABLE target_terms (
    id SERIAL PRIMARY KEY,
    source_term_id INTEGER NOT NULL REFERENCES source_terms(id),
    term VARCHAR(255) NOT NULL,
    language VARCHAR(10) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

-- Index for faster query performance on target_terms
CREATE INDEX idx_target_terms_source_term_id ON target_terms(source_term_id);
