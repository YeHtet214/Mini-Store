-- CREATE TABLE products (
--     id SERIAL PRIMARY KEY,
--     title VARCHAR(50) NOT NULL,
--     price INT NOT NULL,
--     description TEXT NOT NULL,
--     category VARCHAR(50),
--     images VARCHAR(255) NOT NULL
-- );

CREATE TABLE "products" (
  "product_id" INT PRIMARY KEY,
  "name" VARCHAR(50) NOT NULL,
  "description" TEXT NOT NULL,
  "price" INT NOT NULL,
  "category" VARCHAR(50) NOT NULL,
  "category_id" INT NOT NULL,
  "image" TEXT NOT NULL,
  "stock" INT
);

CREATE TABLE "users" (
  "user_id" INT PRIMARY KEY,
  "name" VARCHAR(50) NOT NULL,
  "email" VARCHAR(255) UNIQUE NOT NULL,
  "password" VARCHAR(255) NOT NULL,
  "address" TEXT,
  "phone_number" INT NOT NULL
);

CREATE TABLE "categories" (
  "category_id" INT PRIMARY KEY,
  "name" VARCHAR(50) NOT NULL,
  "description" TEXT
);

CREATE TABLE "orders" (
  "order_id" INT PRIMARY KEY,
  "user_id" INT NOT NULL,
  "order_date" DATE NOT NULL,
  "total_amount" INT NOT NULL,
  "shipping_address" TEXT NOT NULL,
  "order_status" TEXT
);

CREATE TABLE "order_item" (
  "order_id" INT NOT NULL,
  "product_id" INT NOT NULL,
  "quantity" INT NOT NULL
);

CREATE TABLE "cart" (
  "id" INT PRIMARY KEY,
  "user_id" INT NOT NULL
);

CREATE TABLE "cart_item" (
  "id" INT PRIMARY KEY,
  "cart_id" INT NOT NULL,
  "product_id" INT NOT NULL,
  "quantity" INT NOT NULL
);

ALTER TABLE "cart" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("user_id");

ALTER TABLE "cart_item" ADD FOREIGN KEY ("cart_id") REFERENCES "cart" ("id");

ALTER TABLE "cart_item" ADD FOREIGN KEY ("product_id") REFERENCES "products" ("product_id");

ALTER TABLE "order_item" ADD FOREIGN KEY ("product_id") REFERENCES "products" ("product_id");

ALTER TABLE "order_item" ADD FOREIGN KEY ("order_id") REFERENCES "orders" ("order_id");

ALTER TABLE "products" ADD FOREIGN KEY ("category_id") REFERENCES "categories" ("category_id");

CREATE TABLE orders (
  order_id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  address TEXT,
  status VARCHAR(20),
  payment_method TEXT
);

CREATE TABLE OrderItems (
order_item_id SERIAL PRIMARY KEY,
order_id INT NOT NULL,
product_id INT NOT NULL,
price DECIMAL(10,2) NOT NULL,
quantity INT NOT NULL,
total_amount INT NOT NULL,

CONSTRAINT fk_order
  FOREIGN KEY (order_id)
  REFERENCES orders (order_id)
  ON DELETE CASCADE,

CONSTRAINT fK_product
  FOREIGN KEY (product_id)
  REFERENCES products (id)
  ON DELETE CASCADE
);

