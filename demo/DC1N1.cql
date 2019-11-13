-- for demo we recreate the keyspace every time we run
DROP KEYSPACE IF EXISTS universitydb;

-- create universitydb keyspace
CREATE KEYSPACE universitydb
WITH REPLICATION = { 
    -- The SimpleStrategy is a basic replication strategy. 
    -- It's used when using a single datacenter. 
    -- This method is rack unaware. 
    -- It places replicas on subsequent nodes in a clockwise order.
    'class' : 'SimpleStrategy', 
    -- The total number of replicas for a keyspace across a Cassandra cluster is referred 
    -- to as the keyspace's replication factor. 
    -- A replication factor of one means that there is only one copy of each row in the 
    -- Cassandra cluster. 
    'replication_factor' : 1
};

-- use universitydb as main keyspace
use universitydb;

-- create table student
CREATE TABLE student (
  username text PRIMARY KEY,
  fullName text,
  degreeName text,
);

INSERT INTO student (username, fullName, degreeName)
VALUES ('levi.ackerman', 'Levi Ackerman', 'Computer Science');
INSERT INTO student (username, fullName, degreeName)
VALUES ('eren.yeager', 'Eren Yeager', 'Computer Science');
INSERT INTO student (username, fullName, degreeName)
VALUES ('hange.zoe', 'Hange Zoe', 'Science');
