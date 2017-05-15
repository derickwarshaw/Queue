CREATE TABLE IF NOT EXISTS Admin (
   AdminId INTEGER AUTONUMBER PRIMARY KEY,
   AdminName TEXT NOT NULL,
   AdminLocation TEXT NOT NULL,
   AdminDate DATE NOT NULL,
   DashboardId INTEGER,

   CONSTRAINT AdminName_Unique UNIQUE (AdminName),
   FOREIGN KEY (DashboardId) REFERENCES Dashboard(DashboardId)
);
