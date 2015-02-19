-- Initialize DB (Migrations to be considered in the future)
create table event (
  id serial primary key,
  start_time timestamp,
  end_time timestamp,
  organizer varchar(255),
  address varchar(255),
  latitude real,
  longitude real,
  info text,
  url text
);
