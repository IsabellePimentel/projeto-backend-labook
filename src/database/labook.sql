-- Active: 1675819924586@@127.0.0.1@3306
CREATE TABLE users(
    id TEXT PRIMARY KEY UNIQUE NOT NULL, 
    name TEXT NOT NULL, 
    email TEXT NOT NULL, 
    password TEXT NOT NULL, 
    role TEXT NOT NULL, 
    create_at TEXT DEFAULT(DATETIME())
    );

CREATE TABLE posts (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    creator_id TEXT NOT NULL,
    content TEXT NOT NULL,
    likes INTEGER NOT NULL,
    dislikes INTEGER NOT NULL,
    created_at TEXT DEFAULT (DATETIME()) NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (creator_id) REFERENCES users (id)
);
CREATE TABLE likes_dislikes (
    user_id TEXT NOT NULL,
    post_id TEXT NOT NULL,
    like INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (post_id) REFERENCES posts (id)
);

SELECT * FROM users;

SELECT * FROM posts;

SELECT * FROM likes_dislikes;

INSERT INTO users (id, name, email, password, role)
VALUES 
    ("001", "Isabelle", "isabelle@gmail.com", "isa6523", "admin"), 
    ("002", "Jose", "jose@gmail.com", "jose6080", "user");

INSERT INTO posts (id, creator_id, content, likes, dislikes, updated_at)
VALUES ("001", "001", "Como acesso esse site?", "4", "1",DATETIME()),
("002", "001", "Ola,tudo bem?", "5","2",DATETIME()),
("003", "002", "Gostaria de saber informacoes sobre o curso!", "8", "1",DATETIME());

INSERT INTO likes_dislikes(user_id, post_id,like)
VALUES ("001","002", "1"),
("002","001","0");

SELECT * FROM users;
