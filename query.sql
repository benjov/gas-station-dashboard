-- Query to check successful load
SELECT * FROM covid_cases;

SELECT * FROM tabla1;

-- Join tables on county_id
SELECT tabla1."Fecha", tabla1."Cierre", tabla1."DGS10", covid_cases."Total_Cases"
FROM tabla1 LEFT JOIN covid_cases ON tabla1."Fecha" = covid_cases."Date";
