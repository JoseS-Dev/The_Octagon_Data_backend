CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    name_user VARCHAR(100) NOT NULL,
    email_user VARCHAR(100) NOT NULL UNIQUE,
    password_user VARCHAR(150) NOT NULL,
    username VARCHAR(50) UNIQUE,
    image_user VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE login_sessions(
    id SERIAL PRIMARY KEY,
    user_id INT,
    is_active BOOLEAN DEFAULT FALSE,
    FOREIGN KEY(user_id) REFERENCES users(id)
);