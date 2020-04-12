
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

CREATE TABLE users (
  "id" SERIAL PRIMARY KEY,
  "name" varchar UNIQUE,
  "email" varchar UNIQUE,
  "points" int,
  "average_rating" decimal,
  "password" varchar(255)
  
);
CREATE TABLE service_tags (
  "id" SERIAL PRIMARY KEY,
  "service_id" int,
  "hashtag_id" int
);
CREATE TABLE hashtags (
  "id" SERIAL PRIMARY KEY,
  "text" varchar UNIQUE
);

ALTER TABLE "service_tags" ADD FOREIGN KEY ("service_id") REFERENCES "services" ("id");
ALTER TABLE "service_tags" ADD FOREIGN KEY ("hashtag_id") REFERENCES "hashtags" ("id");
ALTER TABLE "services" ADD FOREIGN KEY ("receiver_id") REFERENCES "users" ("id");
ALTER TABLE "services" ADD FOREIGN KEY ("provider_id") REFERENCES "users" ("id");

____________________________________________________________________________________________________________

INSERT INTO users (name, email, points, average_rating, password) VALUES
('ward', 'ward@gmail.com', 22, 2, 123456);
INSERT INTO users (name, email, points, average_rating, password) VALUES
('housni', 'housni@gmail.com', 12, 4, 123456789);
INSERT INTO users (name, email, points, average_rating, password) VALUES
('eduard', 'eduard@gmail.com', 52, 5, 0123456789);
INSERT INTO users (name, email, points, average_rating, password) VALUES
('rahaf', 'rahaf@gmail.com', 32, 3.5, 'rahaf89');


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
INSERT INTO services 
(content,points, receiver_id, provider_id, 
 state, start_date, end_date, review, comment) 
 VALUES
('I need someone to give me h:english h:classes ', 30, 4, 1, 'accepted', '2016-06-23 17:10:25-07','2016-06-23 18:15:25-07', 3, '');
INSERT INTO services 
(content,points, receiver_id, provider_id, 
 state, start_date, end_date, review, comment) 
 VALUES
('I need someone to give me h:math h:classes ', 40, 4, 3, 'accepted', '2016-06-23 17:10:25-07','2016-06-23 18:15:25-07', 3, '');
INSERT INTO services 
(content,points, receiver_id, provider_id, 
 state, start_date, end_date, review, comment) 
 VALUES
('I need someone for h:painting my h:house ', 50, 3, 2, 'accepted', '2016-06-23 18:10:25-07','2016-06-23 19:15:25-07', 1, '');


insert into service_tags (service_id, hashtag_id) Values (1, 2);
insert into service_tags (service_id, hashtag_id) Values (1, 3);
insert into service_tags (service_id, hashtag_id) Values (4, 4);
insert into service_tags (service_id, hashtag_id) Values (3, 4);
insert into service_tags (service_id, hashtag_id) Values (4, 6);
insert into service_tags (service_id, hashtag_id) Values (3, 5);
insert into service_tags (service_id, hashtag_id) Values (2, 7);