-- Initialize DB (Migrations to be considered in the future)
create table event (
  id serial primary key,
  start_time timestamp with time zone,
  end_time timestamp with time zone,
  organizer varchar(255),
  address varchar(255),
  latitude real,
  longitude real,
  info text,
  url text
);
