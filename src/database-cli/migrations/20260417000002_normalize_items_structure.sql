-- +goose Up
-- 1. Crear la tabla de plantillas (Catálogo Maestro)
CREATE TABLE item_templates (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT DEFAULT 'Misc',
    rarity TEXT DEFAULT 'Common',
    is_equippable BOOLEAN DEFAULT false,
    is_usable BOOLEAN DEFAULT false,
    weight FLOAT DEFAULT 0,
    properties TEXT,
    damage TEXT,
    damage_type TEXT,
    ac_bonus INTEGER DEFAULT 0,
    requirements TEXT,
    charges INTEGER DEFAULT 0,
    special_actions JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Mover los objetos actuales de la bóveda (los que no tienen character_id) a la nueva tabla
INSERT INTO item_templates (name, description, category, rarity, is_equippable, is_usable, weight, properties, damage, damage_type, ac_bonus, requirements, charges, special_actions)
SELECT name, description, category, rarity, is_equippable, is_usable, weight, properties, damage, damage_type, ac_bonus, requirements, charges, 
    CASE WHEN special_actions = '' THEN '[]'::jsonb ELSE special_actions::jsonb END
FROM inventory_items WHERE character_id IS NULL;

-- 3. Limpiar inventory_items para que sea solo una tabla de instancias
-- Primero, añadimos la columna template_id
ALTER TABLE inventory_items ADD COLUMN template_id INTEGER REFERENCES item_templates(id);

-- Intentamos vincular los objetos que ya tenían los personajes con sus plantillas recién creadas (por nombre)
UPDATE inventory_items ii
SET template_id = it.id
FROM item_templates it
WHERE ii.name = it.name AND ii.character_id IS NOT NULL;

-- 4. Eliminar columnas redundantes de inventory_items (ahora están en la plantilla)
ALTER TABLE inventory_items 
DROP COLUMN name,
DROP COLUMN description,
DROP COLUMN category,
DROP COLUMN rarity,
DROP COLUMN is_equippable,
DROP COLUMN is_usable,
DROP COLUMN weight,
DROP COLUMN properties,
DROP COLUMN damage,
DROP COLUMN damage_type,
DROP COLUMN ac_bonus,
DROP COLUMN requirements,
DROP COLUMN special_actions;

-- 5. Eliminar los registros que quedaron "huérfanos" (los que eran plantillas en la tabla vieja)
DELETE FROM inventory_items WHERE character_id IS NULL;

-- +goose Down
-- Este es un cambio destructivo difícil de revertir automáticamente al 100%, 
-- pero para desarrollo recreamos la estructura anterior si es necesario.
DROP TABLE item_templates CASCADE;
-- (Aquí se debería restaurar inventory_items, pero es preferible no hacer rollback de esto)
