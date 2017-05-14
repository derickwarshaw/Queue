CREATE TABLE IF NOT EXISTS User (
   UserId   INTEGER AUTONUMBER,
   UserName TEXT NOT NULL,
   UserLocation TEXT NOT NULL,
   UserDate DATE NOT NULL,

   CONSTRAINT UserId_PrimaryKey PRIMARY KEY (UserId),
   CONSTRAINT UserName_Unique UNIQUE (Username)
);
