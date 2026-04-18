-- +goose Up
ALTER TABLE inventory_items ADD COLUMN template_id INTEGER;

-- +goose Down
ALTER TABLE inventory_items DROP COLUMN template_id;
