-- WOG COMPUTER V5.0.0 — disponibilidade automática pelo estoque
-- Executar depois da migração core e da importação dos produtos.
PRAGMA foreign_keys = ON;

UPDATE products
SET status = CASE
  WHEN EXISTS (
    SELECT 1 FROM product_variants v
    WHERE v.product_id = products.id
      AND v.is_active = 1
      AND (v.stock_quantity - v.reserved_quantity) > 0
  ) THEN 'ativo' ELSE 'indisponivel' END
WHERE status IN ('ativo','indisponivel');

CREATE TRIGGER IF NOT EXISTS trg_variant_stock_status_insert
AFTER INSERT ON product_variants
BEGIN
  UPDATE products
  SET status = CASE WHEN EXISTS (
    SELECT 1 FROM product_variants v WHERE v.product_id = NEW.product_id
      AND v.is_active = 1 AND (v.stock_quantity-v.reserved_quantity)>0
  ) THEN 'ativo' ELSE 'indisponivel' END,
  updated_at = CURRENT_TIMESTAMP
  WHERE id = NEW.product_id AND status IN ('ativo','indisponivel');
END;

CREATE TRIGGER IF NOT EXISTS trg_variant_stock_status_update
AFTER UPDATE OF stock_quantity, reserved_quantity, is_active ON product_variants
BEGIN
  UPDATE products
  SET status = CASE WHEN EXISTS (
    SELECT 1 FROM product_variants v WHERE v.product_id = NEW.product_id
      AND v.is_active = 1 AND (v.stock_quantity-v.reserved_quantity)>0
  ) THEN 'ativo' ELSE 'indisponivel' END,
  updated_at = CURRENT_TIMESTAMP
  WHERE id = NEW.product_id AND status IN ('ativo','indisponivel');
END;

CREATE TRIGGER IF NOT EXISTS trg_variant_stock_status_delete
AFTER DELETE ON product_variants
BEGIN
  UPDATE products
  SET status = CASE WHEN EXISTS (
    SELECT 1 FROM product_variants v WHERE v.product_id = OLD.product_id
      AND v.is_active = 1 AND (v.stock_quantity-v.reserved_quantity)>0
  ) THEN 'ativo' ELSE 'indisponivel' END,
  updated_at = CURRENT_TIMESTAMP
  WHERE id = OLD.product_id AND status IN ('ativo','indisponivel');
END;
