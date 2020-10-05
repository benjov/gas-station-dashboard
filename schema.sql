-- Verefy tables:
DROP TABLE IF EXISTS covid_cases;
DROP TABLE IF EXISTS tabla1;

-- Create Tables

-- Table Covid-19 Cases:
CREATE TABLE covid_cases (
	id SERIAL PRIMARY KEY,
	"Date" TEXT,
	"Total_Cases" INT,
	"Total Deaths" INT,
	"Total Recovered" INT
);

-- Table Finance Indicators
CREATE TABLE tabla1 (
	id SERIAL PRIMARY KEY,
	"Fecha" TEXT,
	"Cierre" NUMERIC, 
	"Apertura" NUMERIC,
	"Maximo" NUMERIC, 
	"Minimo" NUMERIC, 
	"Vol." TEXT,
	"Var" TEXT,
	"DGS10" NUMERIC
);
