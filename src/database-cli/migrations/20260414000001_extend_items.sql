-- +goose Up
-- SQL in this section is executed when the migration is applied.

ALTER TABLE inventory_items 
    ADD COLUMN damage TEXT DEFAULT '',
    ADD COLUMN damage_type TEXT DEFAULT '',
    ADD COLUMN ac_bonus INTEGER DEFAULT 0,
    ADD COLUMN requirements TEXT DEFAULT '',
    ADD COLUMN charges INTEGER DEFAULT 0,
    ADD COLUMN special_actions TEXT DEFAULT '[]';

-- Permitir que character_id sea NULL (para items en la bóveda)
-- Y quitar el CASCADE para que al borrar un PJ el item no desaparezca, sino que quede huérfano (o lo gestionamos manualmente)
-- Por ahora, solo permitimos NULL.
ALTER TABLE inventory_items ALTER COLUMN character_id DROP NOT NULL;

-- +goose Down
-- SQL in this section is executed when the migration is rolled back.
ALTER TABLE inventory_items 
    DROP COLUMN IF EXISTS damage,
    DROP COLUMN IF EXISTS damage_type,
    DROP COLUMN IF EXISTS ac_bonus,
    DROP COLUMN IF EXISTS requirements,
    DROP COLUMN IF EXISTS charges,
    DROP COLUMN IF EXISTS special_actions;
