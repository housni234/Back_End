CREATE TABLE IF NOT EXISTS accounts (
  id SERIAL primary key,
  username varchar(50) NOT NULL,
  password varchar(255) NOT NULL,
  email varchar(100) NOT NULL
) ;
INSERT INTO accounts (username, password, email) VALUES ('rahaf', '123456', 'rahaf@mail.com');
____________________________________________________________________________________________________________

CREATE TABLE IF NOT EXISTS services (
id serial primary key,
provider_id   int,
receiver_id   int,
points       int,
content   varchar,
state         varchar,
start_date   timestamp,
end_date     timestamp,
review         int,
comment        varchar
);

CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY,
  "name" varchar UNIQUE,
  "email" varchar UNIQUE,
  "points" int,
  "average_rating" decimal
);
CREATE TABLE "service_tags" (
  "id" SERIAL PRIMARY KEY,
  "service_id" int,
  "hashtag_id" int
);
CREATE TABLE "hashtags" (
  "id" SERIAL PRIMARY KEY,
  "text" varchar UNIQUE
);

ALTER TABLE "serviceTags" ADD FOREIGN KEY ("serviceId") REFERENCES "services" ("id");
ALTER TABLE "serviceTags" ADD FOREIGN KEY ("hashtagId") REFERENCES "hashtags" ("id");
ALTER TABLE "services" ADD FOREIGN KEY ("receiverId") REFERENCES "users" ("id");
ALTER TABLE "services" ADD FOREIGN KEY ("providerId") REFERENCES "users" ("id");

____________________________________________________________________________________________________________

INSERT INTO users (name, email, points, average_rating) VALUES
('ward', 'ward@gmail.com', 22, 2);
INSERT INTO users (name, email, points, average_rating) VALUES
('housni', 'housni@gmail.com', 12, 4);
INSERT INTO users (name, email, points, average_rating) VALUES
('eduard', 'eduard@gmail.com', 52, 5);
INSERT INTO users (name, email, points, average_rating) VALUES
('rahaf', 'rahaf@gmail.com', 32, 3.5);
INSERT INTO hashtags (text) VALUES
('cats');
INSERT INTO hashtags (text) VALUES
('dogs');
INSERT INTO hashtags (text) VALUES
('vacations');
INSERT INTO hashtags (text) VALUES
('classes');
INSERT INTO hashtags (text) VALUES
('math');
INSERT INTO hashtags (text) VALUES
('english');
INSERT INTO hashtags (text) VALUES
('painting');
INSERT INTO services 
(content,points, receiver_id, provider_id, 
 state, start_date, end_date, review, comment) 
 VALUES
('I need someone to take care of my h:dogs during my h:vacations', 50, 1, 2, 'accepted', '2016-06-22 19:10:25-07','2016-06-29 12:10:25-07', 0, '');
insert into service_tags (service_id, hashtag_id) Values (1, 2);
insert into service_tags (service_id, hashtag_id) Values (1, 3);