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

CREATE TABLE fighters_extras(
	id SERIAL PRIMARY KEY,
	fighter_id INT,
	status_fighter status_of_fighter NOT NULL,
	country_fighter VARCHAR(145),
	team_fighter VARCHAR(180),
	age_fighter INT,
	height_fighter DECIMAL(5,2) NOT NULL,
	weight_fighter DECIMAL(5,2) NOT NULL,
	reach_fighter DECIMAL(5,2) NOT NULL,
	reach_legs_fighter DECIMAL(5,2) NOT NULL,
	FOREIGN KEY(fighter_id) REFERENCES fighters(id)
);

CREATE TABLE fighters_stats(
	id SERIAL PRIMARY KEY,
	fighter_id INT,
	stats_of_legs VARCHAR(80),
	stats_of_clinch VARCHAR(80),
	stats_of_floor VARCHAR(80),
	wins_of_ko_tko VARCHAR(65),
	wins_of_decision VARCHAR(65),
	wins_of_submission VARCHAR(65),
	sig_hits_connected_min DECIMAL(5,2),
	sig_hits_received_min DECIMAL(5,2),
	knockdown_avg_min DECIMAL(5,2),
	submission_avg_min DECIMAL(5,2),
	sig_hits_defense VARCHAR(75),
	takedown_defense VARCHAR(75),
	knockdown_avg DECIMAL(5,2),
	time_fight_avg VARCHAR(100),
	FOREIGN KEY(fighter_id) REFERENCES fighters(id)
); 

-- Tabla intermedia para la relación muchos a muchos entre usuarios y luchadores
CREATE TABLE user_fighters(
	user_id INT,
	fighter_id INT,
	PRIMARY KEY(user_id, fighter_id),
	FOREIGN KEY(user_id) REFERENCES users(id),
	FOREIGN KEY(fighter_id) REFERENCES fighters(id)
);

CREATE TABLE events(
	id SERIAL PRIMARY KEY,
	date_event DATE,
	country_event VARCHAR(255),
	venue_event VARCHAR(255),
	type_event VARCHAR(255)
);

CREATE TABLE event_billoard(
	id SERIAL PRIMARY KEY,
	event_id INT,
	image_red_fighter VARCHAR(255),
	name_red_fighter VARCHAR(125),
	country_red_fighter VARCHAR(155),
	image_blue_fighter VARCHAR(255),
	name_blue_fighter VARCHAR(125),
	country_blue_fighter VARCHAR(155),
	weight_class_fight VARCHAR(155),
	FOREIGN KEY(event_id) REFERENCES events(id)
);
