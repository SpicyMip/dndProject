-- +goose Up
-- SQL in this section is executed when the migration is applied.

-- 1. Characters Table
CREATE TABLE characters (
    id SERIAL PRIMARY KEY,
    owner_id TEXT NOT NULL, -- User Email
    name TEXT NOT NULL,
    race TEXT,
    class TEXT,
    background TEXT,
    alignment TEXT,
    level INTEGER DEFAULT 1,
    experience INTEGER DEFAULT 0,
    current_hp INTEGER,
    max_hp INTEGER,
    temp_hp INTEGER DEFAULT 0,
    initiative INTEGER DEFAULT 0,
    str INTEGER DEFAULT 10,
    dex INTEGER DEFAULT 10,
    con INTEGER DEFAULT 10,
    int INTEGER DEFAULT 10,
    wis INTEGER DEFAULT 10,
    cha INTEGER DEFAULT 10,
    proficiency_bonus INTEGER DEFAULT 2,
    gold INTEGER DEFAULT 0,
    status TEXT DEFAULT 'Active',
    is_active BOOLEAN DEFAULT TRUE
);

-- 2. Enhanced Inventory Items Table
CREATE TABLE inventory_items (
    id SERIAL PRIMARY KEY,
    character_id INTEGER REFERENCES characters(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT DEFAULT '',
    quantity INTEGER DEFAULT 1,
    category TEXT DEFAULT 'Misc', -- Weapon, Armor, Consumable, Tool, Magic Item, Misc
    rarity TEXT DEFAULT 'Common', -- Common, Uncommon, Rare, Very Rare, Legendary
    is_equippable BOOLEAN DEFAULT FALSE,
    is_equipped BOOLEAN DEFAULT FALSE,
    is_usable BOOLEAN DEFAULT FALSE,
    weight REAL DEFAULT 0.0,
    properties TEXT DEFAULT ''
);

-- 3. Lexicon Tables
CREATE TABLE lexicon_words (
    id SERIAL PRIMARY KEY,
    symbol_sequence TEXT UNIQUE NOT NULL,
    dm_notes TEXT,
    discovery_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE lexicon_entries (
    id SERIAL PRIMARY KEY,
    word_id INTEGER REFERENCES lexicon_words(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL, -- User Email
    interpretation TEXT,
    notes TEXT
);

-- 4. Creatures & Notes
CREATE TABLE creatures (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    image_url TEXT,
    type TEXT,
    alignment TEXT,
    armor_class INTEGER,
    hp TEXT,
    speed TEXT,
    str INTEGER,
    dex INTEGER,
    con INTEGER,
    int INTEGER,
    wis INTEGER,
    cha INTEGER,
    saves TEXT,
    skills TEXT,
    resistances TEXT,
    immunities TEXT,
    condition_immunities TEXT,
    senses TEXT,
    languages TEXT,
    challenge TEXT,
    xp INTEGER,
    description TEXT,
    abilities TEXT,
    actions TEXT,
    legendary_actions TEXT,
    is_encountered BOOLEAN DEFAULT FALSE,
    visibility_settings TEXT DEFAULT '{}'
);

CREATE TABLE creature_notes (
    id SERIAL PRIMARY KEY,
    creature_id INTEGER REFERENCES creatures(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL, -- User Email
    content TEXT
);

-- 5. Notice Board
CREATE TABLE notices (
    id SERIAL PRIMARY KEY,
    type TEXT, -- mission, ad, news
    title TEXT NOT NULL,
    content TEXT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Chronicles (Story Arcs & Sessions)
CREATE TABLE story_arcs (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL
);

CREATE TABLE sessions (
    id SERIAL PRIMARY KEY,
    story_arc_id INTEGER REFERENCES story_arcs(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    summary TEXT,
    secret TEXT
);

-- 7. Pantheon (Deities)
CREATE TABLE deities (
    id SERIAL PRIMARY KEY,
    type TEXT, -- greater, lesser
    name TEXT NOT NULL,
    domain TEXT,
    description TEXT,
    symbol TEXT
);

-- +goose Down
-- SQL in this section is executed when the migration is rolled back.
DROP TABLE IF EXISTS deities;
DROP TABLE IF EXISTS sessions;
DROP TABLE IF EXISTS story_arcs;
DROP TABLE IF EXISTS notices;
DROP TABLE IF EXISTS creature_notes;
DROP TABLE IF EXISTS creatures;
DROP TABLE IF EXISTS lexicon_entries;
DROP TABLE IF EXISTS lexicon_words;
DROP TABLE IF EXISTS inventory_items;
DROP TABLE IF EXISTS characters;
