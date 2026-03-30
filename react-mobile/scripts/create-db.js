/**
 * Script to generate shopping.db with sample data
 * Run: node scripts/create-db.js
 */
const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const OUTPUT_PATH = path.join(
  __dirname,
  '../android/app/src/main/assets/database/shopping.db'
);

async function main() {
  const SQL = await initSqlJs();
  const db = new SQL.Database();

  // Room requires the android_metadata table
  db.run(`CREATE TABLE IF NOT EXISTS android_metadata (locale TEXT)`);
  db.run(`INSERT INTO android_metadata VALUES ('en_US')`);

  // Create product_items table matching ProductEntity
  db.run(`
    CREATE TABLE IF NOT EXISTS product_items (
      id          INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      productId   TEXT    NOT NULL,
      productName TEXT    NOT NULL,
      price       REAL    NOT NULL,
      imageUrl    TEXT,
      createdAt   INTEGER NOT NULL
    )
  `);

  // Index matching @Index in ProductEntity
  db.run(`CREATE UNIQUE INDEX IF NOT EXISTS index_product_items_productId ON product_items (productId)`);

  // Create catalog_items table matching CatalogEntity
  db.run(`
    CREATE TABLE IF NOT EXISTS catalog_items (
      id        TEXT    PRIMARY KEY NOT NULL,
      name      TEXT    NOT NULL,
      category  TEXT    NOT NULL,
      price     REAL    NOT NULL,
      salePrice REAL    NOT NULL,
      sale      INTEGER NOT NULL,
      bg        TEXT    NOT NULL,
      image     TEXT    NOT NULL
    )
  `);

  // Catalog seed data
  const catalog = [
    { id: '1', name: 'Sonic-ü Wireless Headphones',        category: 'Electronics', price: 129.0, salePrice: 0.0,   sale: 0, bg: '#D8EDE3', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80' },
    { id: '2', name: 'Metro Classic Timewatch Limited Edition', category: 'Fashion',     price: 85.5,  salePrice: 0.0,   sale: 0, bg: '#E8F0E8', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80' },
    { id: '3', name: 'Artisan Ceramic Mug',                 category: 'Home',        price: 24.0,  salePrice: 0.0,   sale: 0, bg: '#D8EDE3', image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400&q=80' },
    { id: '4', name: 'Glow Essentials Kit',                 category: 'Beauty',      price: 45.0,  salePrice: 60.0,  sale: 1, bg: '#E8EDD8', image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&q=80' },
    { id: '5', name: 'Leather Tote Bag',                    category: 'Fashion',     price: 99.0,  salePrice: 0.0,   sale: 0, bg: '#EDE8D8', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80' },
    { id: '6', name: 'Smart Watch Pro',                     category: 'Electronics', price: 199.0, salePrice: 249.0, sale: 1, bg: '#D8E8ED', image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&q=80' },
    { id: '7', name: 'Minimalist Desk Lamp',                category: 'Home',        price: 39.0,  salePrice: 0.0,   sale: 0, bg: '#EDE8D8', image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&q=80' },
    { id: '8', name: 'Yoga Mat Premium',                    category: 'Beauty',      price: 32.0,  salePrice: 48.0,  sale: 1, bg: '#D8EDE3', image: 'https://images.unsplash.com/photo-1600881333168-2ef49b341f30?w=400&q=80' },
  ];

  const catalogStmt = db.prepare(
    `INSERT INTO catalog_items (id, name, category, price, salePrice, sale, bg, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  );
  catalog.forEach(c => {
    catalogStmt.run([c.id, c.name, c.category, c.price, c.salePrice, c.sale, c.bg, c.image]);
  });
  catalogStmt.free();

  // Sample product list data
  const now = Date.now();
  const products = [
    { id: 'P001', name: 'Wireless Headphones',  price: 129.0, image: null },
    { id: 'P002', name: 'Smart Watch Pro',       price: 199.0, image: null },
    { id: 'P003', name: 'Leather Tote Bag',      price: 99.0,  image: null },
    { id: 'P004', name: 'Running Shoes',          price: 89.0,  image: null },
    { id: 'P005', name: 'Bluetooth Speaker',      price: 59.0,  image: null },
  ];

  const stmt = db.prepare(
    `INSERT INTO product_items (productId, productName, price, imageUrl, createdAt) VALUES (?, ?, ?, ?, ?)`
  );
  products.forEach((p, i) => {
    stmt.run([p.id, p.name, p.price, p.image, now - i * 1000]);
  });
  stmt.free();

  // Export to file
  const data = db.export();
  fs.writeFileSync(OUTPUT_PATH, Buffer.from(data));
  db.close();

  console.log(`✅ Created: ${OUTPUT_PATH}`);
  console.log(`   ${products.length} product_items inserted.`);
  console.log(`   ${catalog.length} catalog_items inserted.`);
}

main().catch(e => { console.error(e); process.exit(1); });
