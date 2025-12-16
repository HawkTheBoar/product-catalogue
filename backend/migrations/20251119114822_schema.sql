-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    parent_id INT,
    FOREIGN KEY (parent_id) REFERENCES categories(id)
);

-- Products Table
CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price INT NOT NULL,
    category_id INT,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    password VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL
);
CREATE TABLE IF NOT EXISTS tokens (
    token VARCHAR(32) PRIMARY KEY,
    admin_id INT,
    FOREIGN KEY (admin_id) REFERENCES admins(id)
);
