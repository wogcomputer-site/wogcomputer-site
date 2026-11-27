-- WOG COMPUTER V4.0.0 — modelo inicial SQLite / Cloudflare D1
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY, parent_id TEXT REFERENCES categories(id),
  name TEXT NOT NULL, slug TEXT NOT NULL UNIQUE, description TEXT,
  image_url TEXT, sort_order INTEGER NOT NULL DEFAULT 0,
  is_active INTEGER NOT NULL DEFAULT 1, created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS brands (
  id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE, created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY, category_id TEXT NOT NULL REFERENCES categories(id),
  brand_id INTEGER REFERENCES brands(id), name TEXT NOT NULL, slug TEXT NOT NULL UNIQUE,
  manufacturer TEXT, model TEXT, gtin TEXT, short_description TEXT,
  description TEXT NOT NULL, condition TEXT NOT NULL CHECK(condition IN ('novo','usado','recondicionado')),
  status TEXT NOT NULL CHECK(status IN ('rascunho','ativo','inativo','esgotado','arquivado','indisponivel')),
  is_featured INTEGER NOT NULL DEFAULT 0, meta_title TEXT, meta_description TEXT,
  is_indexable INTEGER NOT NULL DEFAULT 0, created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS product_variants (
  id TEXT PRIMARY KEY, product_id TEXT NOT NULL REFERENCES products(id),
  sku TEXT NOT NULL UNIQUE, variant_name TEXT, attributes_json TEXT,
  price_cents INTEGER NOT NULL DEFAULT 0, sale_price_cents INTEGER,
  cost_price_cents INTEGER, compare_at_price_cents INTEGER,
  stock_quantity INTEGER NOT NULL DEFAULT 0, reserved_quantity INTEGER NOT NULL DEFAULT 0,
  minimum_stock INTEGER NOT NULL DEFAULT 0, maximum_stock INTEGER,
  manage_stock INTEGER NOT NULL DEFAULT 1, allow_backorder INTEGER NOT NULL DEFAULT 0,
  weight_grams INTEGER, package_height_cm REAL, package_width_cm REAL, package_length_cm REAL,
  shipping_enabled INTEGER NOT NULL DEFAULT 1, is_fragile INTEGER NOT NULL DEFAULT 0,
  warranty_days INTEGER, warranty_type TEXT, is_active INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE IF NOT EXISTS product_images (
  id INTEGER PRIMARY KEY AUTOINCREMENT, product_id TEXT NOT NULL REFERENCES products(id),
  variant_id TEXT REFERENCES product_variants(id), image_url TEXT NOT NULL, public_id TEXT,
  alt_text TEXT, image_type TEXT NOT NULL DEFAULT 'gallery',
  sort_order INTEGER NOT NULL DEFAULT 0, created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS attributes (
  id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL UNIQUE,
  code TEXT NOT NULL UNIQUE, data_type TEXT NOT NULL DEFAULT 'text',
  unit TEXT, is_filterable INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS category_attributes (
  category_id TEXT NOT NULL REFERENCES categories(id),
  attribute_id INTEGER NOT NULL REFERENCES attributes(id),
  is_required INTEGER NOT NULL DEFAULT 0, is_variant INTEGER NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY(category_id,attribute_id)
);
CREATE TABLE IF NOT EXISTS product_attribute_values (
  product_id TEXT NOT NULL REFERENCES products(id),
  variant_id TEXT REFERENCES product_variants(id),
  attribute_id INTEGER NOT NULL REFERENCES attributes(id), value TEXT NOT NULL,
  PRIMARY KEY(product_id,variant_id,attribute_id)
);
CREATE TABLE IF NOT EXISTS inventory_movements (
  id INTEGER PRIMARY KEY AUTOINCREMENT, variant_id TEXT NOT NULL REFERENCES product_variants(id),
  movement_type TEXT NOT NULL CHECK(movement_type IN ('entrada','venda','cancelamento','devolucao','ajuste','perda','transferencia')),
  quantity INTEGER NOT NULL, reason TEXT, reference_id TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS product_promotions (
  id INTEGER PRIMARY KEY AUTOINCREMENT, variant_id TEXT NOT NULL REFERENCES product_variants(id),
  sale_price_cents INTEGER NOT NULL, starts_at TEXT, ends_at TEXT, is_active INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE IF NOT EXISTS product_tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT, product_id TEXT NOT NULL REFERENCES products(id),
  tag TEXT NOT NULL, UNIQUE(product_id,tag)
);
CREATE TABLE IF NOT EXISTS product_reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT, product_id TEXT NOT NULL REFERENCES products(id),
  customer_name TEXT, rating INTEGER NOT NULL CHECK(rating BETWEEN 1 AND 5),
  comment TEXT, moderation_status TEXT NOT NULL DEFAULT 'pending',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS product_bundles (
  id INTEGER PRIMARY KEY AUTOINCREMENT, product_id TEXT NOT NULL REFERENCES products(id),
  component_variant_id TEXT NOT NULL REFERENCES product_variants(id), quantity INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE IF NOT EXISTS suppliers (
  id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL,
  contact_email TEXT, contact_phone TEXT, notes TEXT
);
CREATE TABLE IF NOT EXISTS purchase_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT, supplier_id INTEGER REFERENCES suppliers(id),
  variant_id TEXT NOT NULL REFERENCES product_variants(id), quantity INTEGER NOT NULL,
  unit_cost_cents INTEGER, purchase_status TEXT NOT NULL DEFAULT 'planned',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_products_category_status ON products(category_id,status);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_variants_sku ON product_variants(sku);
CREATE INDEX IF NOT EXISTS idx_inventory_variant_date ON inventory_movements(variant_id,created_at);
