CREATE TABLE employees
(
    id SERIAL,
    name text,
    title text,
    avatar text,
    CONSTRAINT employees_pkey PRIMARY KEY (id)
);

INSERT INTO employees(name, title, avatar) VALUES
 ('Meadow Crystalfreak ', 'Head of Operations','https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50.jpg'),
 ('Buddy-Ray Perceptor', 'DevRel','https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50.jpg'),
 ('Prince Flitterbell', 'Marketing Guru','https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50.jpg');