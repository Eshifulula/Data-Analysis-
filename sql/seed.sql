INSERT INTO users (username, password_hash, role) VALUES
('admin', '$2b$10$REPLACE_WITH_REAL_BCRYPT_HASH_FOR_ADMIN', 'admin'),
('dayshift', '$2b$10$REPLACE_WITH_REAL_BCRYPT_HASH_FOR_DAYSHIFT', 'supervisor'),
('nightshift', '$2b$10$REPLACE_WITH_REAL_BCRYPT_HASH_FOR_NIGHTSHIFT', 'supervisor'),
('viewer', '$2b$10$REPLACE_WITH_REAL_BCRYPT_HASH_FOR_VIEWER', 'viewer')
ON CONFLICT (username) DO NOTHING;

WITH u AS (SELECT id FROM users WHERE username='admin')
INSERT INTO shifts (shift_date, shift_type, employee_name, check_in_time, phone_number, location, submitted_by)
SELECT * FROM (
VALUES
('2026-05-13','Night','James Babu','19:00','0726846003','Store (Voi Girls Junction)'),
('2026-05-13','Night','Jackson','19:00','0700193560','Vindo (Machines Area)'),
('2026-05-13','Night','Ben Mwachoki','19:00','0762067726','Behind Avid'),
('2026-05-13','Night','Joel Mwanganyi','19:00','0716789999','Machines Area'),
('2026-05-13','Night','Julius Nyali','19:00','0797837971','Bura (Machines Area)'),
('2026-05-13','Night','Raphael Mombo','19:00','0797397048','Calvart Box 1'),
('2026-05-13','Night','Kenneth','19:00','0713311690','Majengo (Machines Area)'),
('2026-05-13','Night','Syprian','19:00','0796252229','Mwakitau Station'),
('2026-05-13','Night','Samuel Mulinge','19:00','0716490529','Taveta'),
('2026-05-13','Night','Cosmas Nyambu','19:00','0710865317','Taveta'),
('2026-05-13','Night','Benson Mwalughongo','19:00','0768656899','Kibao ya Munda (Machines Area)'),
('2026-05-13','Night','Chrispin','19:00','0706074657','Border (Machines Area)'),
('2026-05-13','Night','Samuel','19:00','0732732651','Border (Machines Area)'),
('2026-05-14','Day','Liverson Mwaluda','06:13','0113132923','Bura (Machines Area)'),
('2026-05-14','Day','Salim Mangi','06:07','0700643635','Store (Voi Girls Junction)'),
('2026-05-14','Day','Williamson Mkilo','06:20','0701328547','Majengo (Slippers Area)'),
('2026-05-14','Day','Harrison Mwanthi','06:10','0799979709','Mwakitau Station (Machines Area)'),
('2026-05-14','Day','Simon Mbiti','06:15','0791469518','Taveta Station (Machines Area)'),
('2026-05-14','Day','Harrison','06:25','0748612292','Zare (Machines Area)'),
('2026-05-14','Day','Gibran Mwandango','06:17','0791289832','Kibao ya Munda (Machines Area)'),
('2026-05-14','Day','Mulinde','06:12','0700397643','Taveta Border (Machines Area)')
) v(shift_date,shift_type,employee_name,check_in_time,phone_number,location), u
ON CONFLICT DO NOTHING;
