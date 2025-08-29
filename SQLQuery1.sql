drop database ticket_management;
create database ticket_management;

--drop table users
create table users (
    userid int primary key,
    fullname varchar(100) not null,
    email varchar(100) not null,
    phone varchar(20) not null,
    urole varchar(50) not null
);

insert into users (userid, fullname, email, phone, urole)
values 
    (1, 'john doe', 'john.doe@example.com', '123-456-7890', 'admin'),
    (2, 'jane smith', 'jane.smith@example.com', '098-765-4321', 'user'),
    (3, 'mike rahman', 'mike.rahman@example.com', '017-111-2222', 'user');

--drop table routes 
create table routes (
    rid int primary key,
    fromlocation varchar(100) not null,
    tolocation varchar(100) not null
);

insert into routes (rid, fromlocation, tolocation)
values
    (101, 'dhaka', 'chittagong'),
    (102, 'sylhet', 'dhaka'),
    (103, 'rajshahi', 'khulna');

select * from routes
--drop table bus
create table bus (
    busid int primary key,
    busnumber varchar(20) not null,
    bustype varchar(50) not null,
    company varchar(100),
    status varchar(20) not null
);

insert into bus (busid, busnumber, bustype, company, status)
values
    (1, 'dhk-101', 'ac', 'green line', 'active'),
    (2, 'syl-202', 'non-ac', 'shohoz', 'active'),
    (3, 'raj-303', 'ac', 'hanif', 'maintenance');

--drop table driver
create table driver (
    driverid int primary key,
    fullname varchar(100) not null,
    phone varchar(20),
    licensenum varchar(50) not null,
    assignedbusid int,
    foreign key (assignedbusid) references bus(busid)
);

insert into driver (driverid, fullname, phone, licensenum, assignedbusid)
values
    (1, 'kabir hossain', '019-333-4444', 'lic-12345', 1),
    (2, 'rashid ali', '018-555-6666', 'lic-67890', 2),
    (3, 'selim ahmed', '017-777-8888', 'lic-54321', 3);

--drop table admin

create table admin (
    adminid int primary key,
    fullname varchar(100) not null,
    email varchar(100) not null,
    PassKey varchar(10) not null
);

insert into admin (adminid, fullname, email, PassKey)
values
    (1, 'sofia akter', 'sofia.akter@example.com', '456654'),
    (2, 'rahim uddin', 'rahim.uddin@example.com', '123321');

select * from admin

--drop table schedules
create table schedules (
    scheid int primary key,
    dtime datetime not null,
    routesid int not null,
    busid int not null,
    fare decimal(10, 2) not null,
);

insert into schedules (scheid, dtime, routesid, busid, fare)
values 
    (1, '2025-08-22 08:00:00', 101, 1, 500.00),
    (2, '2025-08-22 10:00:00', 102, 2, 450.00),
    (3, '2025-08-23 09:00:00', 103, 3, 600.00);

--drop table tickets
create table tickets(
    ticket_id int identity(1,1) primary key,
    userid int NULL,            
    scheid int not null,              
    payid int,                       
    seatnum varchar(10) not null,     
    btime datetime not null,          
    tamount decimal(10,2) not null,   
    is_sold bit not null,
    foreign key (userid) references users(userid),
    foreign key (scheid) references schedules(scheid),
);

--drop table payment
create table payment (
    payid int primary key,
    ticketid int not null,
    userid int not null,
    ptime datetime not null,
    tamount decimal(10,2) not null,
    method varchar(50),
    pstatus varchar(20),
    foreign key (ticketid) references tickets(ticket_id),
    foreign key (userid) references users(userid)
);

-- insert tickets
insert into tickets (userid, scheid, seatnum, btime, tamount,is_sold)
values
(1, 1, 'a1', '2025-08-22 10:30:00', 500.00, 1), 
(2, 2, 'b5', '2025-08-22 11:00:00', 750.00, 0),
(1, 1, 'c3', '2025-08-23 09:15:00', 600.00, 0), 
(2, 2, 'd2', '2025-08-23 14:45:00', 800.00, 1), 
(3, 3, 'e7', '2025-08-24 08:00:00', 450.00, 1);

-- insert payment (after tickets exist)
insert into payment (payid, ticketid, userid, ptime, tamount, method, pstatus)
values
(301, 1, 1, '2025-08-22 10:35:00', 500.00, 'bkash', 'paid'),
(302, 2, 2, '2025-08-22 11:05:00', 750.00, 'cash', 'pending'),
(303, 3, 1, '2025-08-23 09:20:00', 600.00, 'nagad', 'failed'),
(304, 4, 2, '2025-08-23 14:50:00', 800.00, 'card', 'paid'),
(305, 5, 3, '2025-08-24 08:05:00', 450.00, 'bkash', 'paid');
select * from users;

SELECT 
    s.scheid,
    s.dtime,
    r.fromlocation,
    r.tolocation,
    b.busnumber,
    b.bustype,
    d.fullname AS drivername,
    d.licensenum,
    s.fare
FROM schedules s
JOIN routes r ON s.routesid = r.rid
JOIN bus b ON s.busid = b.busid
LEFT JOIN driver d ON b.busid = d.assignedbusid;

