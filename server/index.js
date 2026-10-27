import { randomBytes, scryptSync, createHash, timingSafeEqual } from "node:crypto";
import { mkdirSync, unlinkSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import multer from "multer";
import { DatabaseSync } from "node:sqlite";

const serverDirectory = path.dirname(fileURLToPath(import.meta.url));
const dataDirectory = path.join(serverDirectory, "data");
const databasePath = process.env.SHOP_DATABASE_PATH || path.join(dataDirectory, "shop.sqlite");
const uploadDirectory = process.env.SHOP_UPLOAD_DIRECTORY || path.join(serverDirectory, "uploads");
mkdirSync(path.dirname(databasePath), { recursive: true });
mkdirSync(uploadDirectory, { recursive: true });

const database = new DatabaseSync(databasePath);
database.exec(`
  PRAGMA journal_mode = WAL;
  CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS admin_sessions (
    token_hash TEXT PRIMARY KEY,
    admin_id INTEGER NOT NULL REFERENCES admins(id) ON DELETE CASCADE,
    expires_at INTEGER NOT NULL
  );
  CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    price REAL NOT NULL,
    image TEXT NOT NULL,
    category TEXT NOT NULL,
    sub_category TEXT NOT NULL,
    sizes TEXT NOT NULL,
    bestseller INTEGER NOT NULL DEFAULT 0,
    created_at INTEGER NOT NULL
  );
  DELETE FROM admin_sessions WHERE expires_at <= ${Date.now()};
`);

const hashPassword = (password, salt = randomBytes(16).toString("hex")) => {
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
};

const verifyPassword = (password, storedHash) => {
  const [salt, expectedHash] = storedHash.split(":");
  const actualHash = scryptSync(password, salt, 64);
  const expected = Buffer.from(expectedHash, "hex");
  return actualHash.length === expected.length && timingSafeEqual(actualHash, expected);
};

const existingAdmin = database.prepare("SELECT id FROM admins LIMIT 1").get();
if (!existingAdmin) {
  const email = (process.env.ADMIN_EMAIL || "admin@shop.local").trim().toLowerCase();
  const configuredPassword = process.env.ADMIN_PASSWORD;
  if (configuredPassword && configuredPassword.length < 12) {
    throw new Error("ADMIN_PASSWORD must contain at least 12 characters.");
  }

  const password = configuredPassword || `${randomBytes(18).toString("base64url")}A1!`;
  database.prepare("INSERT INTO admins (email, password_hash) VALUES (?, ?)").run(
    email,
    hashPassword(password),
  );
  console.log(`Initial admin email: ${email}`);
  if (!configuredPassword) {
    console.log(`Initial admin password (save it now): ${password}`);
  }
}

const app = express();
const sessionCookie = "sbt_admin_session";
const sessionDurationMs = 7 * 24 * 60 * 60 * 1000;

app.disable("x-powered-by");
app.use(express.json({ limit: "1mb" }));
app.use("/uploads", express.static(uploadDirectory, {
  dotfiles: "deny",
  index: false,
  maxAge: "1d",
  setHeaders: (response) => response.setHeader("X-Content-Type-Options", "nosniff"),
}));

const getCookie = (request, name) => {
  const cookies = request.headers.cookie?.split(";") || [];
  const cookie = cookies.find((item) => item.trim().startsWith(`${name}=`));
  return cookie ? decodeURIComponent(cookie.trim().slice(name.length + 1)) : null;
};

const hashToken = (token) => createHash("sha256").update(token).digest("hex");

const requireAdmin = (request, response, next) => {
  const token = getCookie(request, sessionCookie);
  if (!token) {
    response.status(401).json({ error: "Admin login required." });
    return;
  }

  const session = database.prepare(`
    SELECT admins.id, admins.email
    FROM admin_sessions
    JOIN admins ON admins.id = admin_sessions.admin_id
    WHERE admin_sessions.token_hash = ? AND admin_sessions.expires_at > ?
  `).get(hashToken(token), Date.now());

  if (!session) {
    response.status(401).json({ error: "Admin login required." });
    return;
  }

  request.admin = session;
  next();
};

app.get("/api/products", (_request, response) => {
  const rows = database.prepare(`
    SELECT id, name, description, price, image, category, sub_category, sizes,
           bestseller, created_at
    FROM products
    ORDER BY created_at DESC
  `).all();

  response.json(rows.map((product) => ({
    _id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    image: [product.image],
    category: product.category,
    subCategory: product.sub_category,
    sizes: JSON.parse(product.sizes),
    bestseller: Boolean(product.bestseller),
    date: product.created_at,
  })));
});

app.post("/api/admin/login", (request, response) => {
  const email = typeof request.body?.email === "string"
    ? request.body.email.trim().toLowerCase()
    : "";
  const password = typeof request.body?.password === "string"
    ? request.body.password
    : "";
  const admin = database.prepare(
    "SELECT id, email, password_hash FROM admins WHERE email = ?",
  ).get(email);

  if (!admin || !verifyPassword(password, admin.password_hash)) {
    response.status(401).json({ error: "អ៊ីមែល ឬពាក្យសម្ងាត់មិនត្រឹមត្រូវទេ។" });
    return;
  }

  const token = randomBytes(32).toString("hex");
  const expiresAt = Date.now() + sessionDurationMs;
  database.prepare(
    "INSERT INTO admin_sessions (token_hash, admin_id, expires_at) VALUES (?, ?, ?)",
  ).run(hashToken(token), admin.id, expiresAt);

  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  response.setHeader(
    "Set-Cookie",
    `${sessionCookie}=${encodeURIComponent(token)}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${sessionDurationMs / 1000}${secure}`,
  );
  response.json({ email: admin.email });
});

app.get("/api/admin/session", requireAdmin, (request, response) => {
  response.json({ email: request.admin.email });
});

app.post("/api/admin/logout", (request, response) => {
  const token = getCookie(request, sessionCookie);
  if (token) {
    database.prepare("DELETE FROM admin_sessions WHERE token_hash = ?").run(hashToken(token));
  }

  response.setHeader(
    "Set-Cookie",
    `${sessionCookie}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0`,
  );
  response.json({ success: true });
});

const acceptedImageTypes = new Map([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
]);

const upload = multer({
  storage: multer.diskStorage({
    destination: uploadDirectory,
    filename: (_request, file, callback) => {
      callback(null, `${randomBytes(16).toString("hex")}${acceptedImageTypes.get(file.mimetype)}`);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_request, file, callback) => {
    if (!acceptedImageTypes.has(file.mimetype)) {
      const error = new Error("រូបភាពត្រូវតែជា JPG, PNG ឬ WebP។");
      error.status = 400;
      callback(error);
      return;
    }
    callback(null, true);
  },
});

app.get("/api/admin/products", requireAdmin, (_request, response) => {
  const rows = database.prepare(`
    SELECT id, name, description, price, image, category, sub_category, sizes,
           bestseller, created_at
    FROM products
    ORDER BY created_at DESC
  `).all();

  response.json(rows.map((product) => ({
    _id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    image: [product.image],
    category: product.category,
    subCategory: product.sub_category,
    sizes: JSON.parse(product.sizes),
    bestseller: Boolean(product.bestseller),
    date: product.created_at,
  })));
});

app.post("/api/admin/products", requireAdmin, upload.single("image"), (request, response) => {
  const { name, description, price, category, subCategory, sizes } = request.body;
  const cleanName = typeof name === "string" ? name.trim() : "";
  const cleanDescription = typeof description === "string" ? description.trim() : "";
  const numericPrice = Number(price);
  let parsedSizes;

  try {
    parsedSizes = JSON.parse(sizes);
  } catch {
    if (request.file) unlinkSync(request.file.path);
    response.status(400).json({ error: "សូមជ្រើសរើសទំហំផលិតផល។" });
    return;
  }

  const validSizes = ["S", "M", "L", "XL", "XXL"];
  const isValid = cleanName.length > 0
    && cleanName.length <= 120
    && cleanDescription.length > 0
    && cleanDescription.length <= 1000
    && Number.isFinite(numericPrice)
    && numericPrice > 0
    && ["Men", "Women", "Kids"].includes(category)
    && ["Topwear", "Bottomwear", "Winterwear"].includes(subCategory)
    && Array.isArray(parsedSizes)
    && parsedSizes.length > 0
    && parsedSizes.every((size) => validSizes.includes(size))
    && request.file;

  if (!isValid) {
    if (request.file) unlinkSync(request.file.path);
    response.status(400).json({ error: "សូមពិនិត្យព័ត៌មានផលិតផល និងរូបភាពម្តងទៀត។" });
    return;
  }

  const id = randomBytes(12).toString("hex");
  const image = `/uploads/${request.file.filename}`;
  try {
    database.prepare(`
      INSERT INTO products
        (id, name, description, price, image, category, sub_category, sizes, bestseller, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      cleanName,
      cleanDescription,
      numericPrice,
      image,
      category,
      subCategory,
      JSON.stringify([...new Set(parsedSizes)]),
      request.body.bestseller === "true" ? 1 : 0,
      Date.now(),
    );
  } catch (error) {
    unlinkSync(request.file.path);
    throw error;
  }

  response.status(201).json({
    _id: id,
    name: cleanName,
    description: cleanDescription,
    price: numericPrice,
    image: [image],
    category,
    subCategory,
    sizes: [...new Set(parsedSizes)],
    bestseller: request.body.bestseller === "true",
    date: Date.now(),
  });
});

app.use((error, _request, response, _next) => {
  void _next;
  console.error(error);
  if (error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE") {
    response.status(400).json({ error: "រូបភាពត្រូវមានទំហំមិនលើស 5MB។" });
    return;
  }

  if (error instanceof multer.MulterError || error.status === 400) {
    response.status(400).json({ error: error.message || "សំណើមិនអាចដំណើរការបានទេ។" });
    return;
  }

  response.status(500).json({ error: "មានបញ្ហាក្នុង server។ សូមព្យាយាមម្តងទៀត។" });
});

const port = Number(process.env.PORT) || 3001;
app.listen(port, () => {
  console.log(`Shop API listening on http://localhost:${port}`);
});
