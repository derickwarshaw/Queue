CREATE TABLE IF NOT EXISTS User (
   UserId TEXT PRIMARY KEY,
   UserName TEXT NOT NULL,
   UserLocation TEXT NOT NULL,
   UserNumber INTEGER NOT NULL,
   UserDate DATE NOT NULL,
   ClientId INTEGER,

   CONSTRAINT UserName_Unique UNIQUE (Username)
   FOREIGN KEY (ClientId) REFERENCES Client(ClientId)
);
