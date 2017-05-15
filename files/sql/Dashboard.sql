CREATE TABLE IF NOT EXISTS Dashboard (
   DashboardId INTEGER NOT NULL,
   DashboardRoom TEXT NOT NULL,

   CONSTRAINT DashboardRoom_Unique UNIQUE (DashboardRoom)
);
