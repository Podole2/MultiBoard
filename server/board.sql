use goods;

create table board_edit(
  board_idx int auto_increment primary key,
  board_name varchar(50),
  board_type varchar(20),
  board_url varchar(255),
  secret char(1) default 'F',
  read_allow varchar(10),
  write_allow varchar(10),
  reply_allow varchar(10),
  modify_allow varchar(10),
  delete_allow varchar(10),
  upload varchar(10),
  download varchar(10), 
  board_desc varchar(255),
  create_date datetime
);

create table board_const(
  idx int auto_increment primary key,
  board_idx int,
  title varchar(50),
  writer varchar(20),
  passwd varchar(20),
  contents text,
  image varchar(255),
  count int default 0,
  regdate datetime,
  foreign key (board_idx) references board_edit(board_idx)
);

create table board_item(
  idx int auto_increment primary key,
  board_idx int,
  seller_name varchar(50),
  item_name varchar(100),
  price varchar(50),
  stock int,
  contents text,
  image varchar(255),
  regdate datetime,
  foreign key (board_idx) references board_edit(board_idx)
);