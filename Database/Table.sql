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

-- Tabla de las comunidades
CREATE TABLE communities(
    id SERIAL PRIMARY KEY,
    name_community VARCHAR(155) NOT NULL,
    descripcion_community TEXT,
    image_community VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    is_blocked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INT,
    members_count INT DEFAULT 0,
    type_community VARCHAR(50) DEFAULT 'public', -- public, private, secret
    FOREIGN KEY(created_by) REFERENCES users(id)
)

-- Tabla intermedia para la relación muchos a muchos entre usuarios y comunidades
CREATE TABLE user_communities(
    id SERIAL PRIMARY KEY,
    user_id INT,
    community_id INT,
    role VARCHAR(50) DEFAULT 'member', -- roles: member, admin, moderator
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	is_banned BOOLEAN DEFAULT FALSE,
	banned_at TIMESTAMP,
	banned_text TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(community_id) REFERENCES communities(id)
);

CREATE TABLE fighters(
	id SERIAL PRIMARY KEY,
	name_fighter VARCHAR(255) NOT NULL,
	nickname_fighter VARCHAR(255) NOT NULL,
	image_fighter VARCHAR(255) NOT NULL,
    weight_class VARCHAR(100) NOT NULL,
    record_fighter VARCHAR(50) NOT NULL
);

-- Tabla intermedia para la relación muchos a muchos entre usuarios y luchadores
CREATE TABLE user_fighters(
	user_id INT,
	fighter_id INT,
	PRIMARY KEY(user_id, fighter_id),
	FOREIGN KEY(user_id) REFERENCES users(id),
	FOREIGN KEY(fighter_id) REFERENCES fighters(id)
);
