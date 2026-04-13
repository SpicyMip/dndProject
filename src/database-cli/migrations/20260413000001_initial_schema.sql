-- +goose Up
-- SQL in this section is executed when the migration is applied.

CREATE TABLE IF NOT EXISTS characters (
    id TEXT PRIMARY KEY,
    owner_id TEXT,
    name TEXT NOT NULL,
    class TEXT,
    level INTEGER DEFAULT 1,
    current_hp INTEGER,
    max_hp INTEGER,
    str INTEGER,
    dex INTEGER,
    con INTEGER,
    int INTEGER,
    wis INTEGER,
    cha INTEGER,
    influence INTEGER DEFAULT 0,
    gold INTEGER DEFAULT 0,
    status TEXT DEFAULT 'Active'
);

CREATE TABLE IF NOT EXISTS inventory_items (
    id TEXT PRIMARY KEY,
    character_id TEXT REFERENCES characters(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    quantity INTEGER DEFAULT 1,
    type TEXT -- "weapon" | "armor" | "consumable" | "quest" | "misc"
);

CREATE TABLE IF NOT EXISTS shared_items (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    quantity INTEGER DEFAULT 1,
    type TEXT,
    icon TEXT,
    fixed BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS interpretations (
    id TEXT PRIMARY KEY,
    symbol_sequence TEXT NOT NULL,
    user_definition TEXT,
    notes TEXT,
    discovery_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notices (
    id TEXT PRIMARY KEY,
    type TEXT, -- "mission" | "ad" | "news"
    title TEXT NOT NULL,
    content TEXT,
    x INTEGER,
    y INTEGER,
    rotation INTEGER
);

CREATE TABLE IF NOT EXISTS creatures (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT,
    cr TEXT,
    hp TEXT,
    ac TEXT,
    vulnerabilities TEXT,
    description TEXT
);

CREATE TABLE IF NOT EXISTS deities (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    deleted_at TIMESTAMP WITH TIME ZONE,
    type TEXT, -- "greater" | "lesser"
    name TEXT NOT NULL,
    domain TEXT,
    description TEXT,
    symbol TEXT
);

CREATE INDEX idx_deities_deleted_at ON deities(deleted_at);

CREATE TABLE IF NOT EXISTS story_arcs (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    story_arc_id TEXT REFERENCES story_arcs(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    summary TEXT,
    secret TEXT
);

-- +goose Down
-- SQL in this section is executed when the migration is rolled back.

DROP TABLE IF EXISTS sessions;
DROP TABLE IF EXISTS story_arcs;
DROP TABLE IF EXISTS deities;
DROP TABLE IF EXISTS creatures;
DROP TABLE IF EXISTS notices;
DROP TABLE IF EXISTS interpretations;
DROP TABLE IF EXISTS shared_items;
DROP TABLE IF EXISTS inventory_items;
DROP TABLE IF EXISTS characters;
