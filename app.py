# Dependencies and Setup
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import requests
from sqlalchemy import create_engine
import scipy.stats as stats
import json
from flask import Flask, jsonify


###### ETL Section #######

#################################################
# Extract CSV's into DataFrames
#################################################
Price_Sep27_2020_df = pd.read_csv('Price_Sep27_2020.csv')

Price_State_df = pd.read_csv('Price_State.csv')

Price_Time_Serie_df = pd.read_csv('Price_Time_Serie.csv')

#################################################
# Database Setup and Connection
#################################################
#connection_string = "postgres:Analyticsfede8484@localhost:5432/Gas_Price_MX"
connection_string = "postgres:postgres@localhost:5432/Gas_Price_MX"

engine = create_engine(f'postgresql://{connection_string}')

#################################################
# Load DataFrames into database
#################################################

Price_Sep27_2020_df.to_sql(name = 'price_sep27_2020', con = engine, if_exists = 'replace', index = False)

Price_State_df.to_sql(name = 'price_state', con = engine, if_exists = 'replace', index = False)

Price_Time_Serie_df.to_sql(name = 'price_time_serie', con = engine, if_exists = 'replace', index = False)



###### Flask Section ######

#################################################
# Flask Setup
#################################################

app = Flask(__name__)


#################################################
# Flask Routes
#################################################

@app.route("/")
def welcome():
    """List all available API routes."""
    return (
        f"Available Routes:<br/>"
        f"/api/v1.0/price_sep27_2020<br/>"
        f"/api/v1.0/price_state<br/>"
        f"/api/v1.0/price_state_geojson<br/>"
        f"/api/v1.0/price_time_serie"
    )

#################################################

@app.route("/api/v1.0/price_sep27_2020")
def price_station():
    # Create oconnection from Python to the DB
    #connection_string = "postgres:postgres@localhost:5432/Gas_Price_MX"

    #engine = create_engine(f'postgresql://{connection_string}')

    """Return a prices by station"""
    # Query all station and prices
    price_sep27_2020 = pd.read_sql_query('select * from price_sep27_2020', con=engine)

    # Transformations if it is necessary
    # MORE CODE HERE
    
    #
    
    #price_sep27_2020_li = list(np.ravel(price_sep21_2020))
    #return jsonify(price_sep27_2020_li)
    
    return price_sep27_2020.to_json(orient='table', date_format = 'iso', index = False)

#################################################

@app.route("/api/v1.0/price_state")
def price_state():
    # Create oconnection from Python to the DB
    #connection_string = "postgres:postgres@localhost:5432/Gas_Price_MX"

    #engine = create_engine(f'postgresql://{connection_string}')

    """Return average prices by state"""
    # Query all station and prices
    price_state = pd.read_sql_query('select * from price_state', con=engine)
    
    # Transformations if it is necessary
    # MORE CODE HERE
    
    #
    
    #price_state_li = list(np.ravel(price_state))
    #return jsonify(price_state_li)
    
    return price_state.to_json(orient='table', date_format = 'iso', index = False)

#################################################

@app.route("/api/v1.0/price_state_geojson")
def price_state_geo():
    # Create oconnection from Python to the DB
    #connection_string = "postgres:postgres@localhost:5432/Gas_Price_MX"

    #engine = create_engine(f'postgresql://{connection_string}')

    """Return average prices by state in GEOJSON"""
    # Query all station and prices
    price_state = pd.read_sql_query('select * from price_state', con=engine)
    
    # Transformations 
    price_state['latitude'] = price_state['Latitud'].astype(float)
    
    price_state['longitude'] = price_state['Longitud'].astype(float)
    
    price_state = price_state.loc[(price_state.Year == 2020) & (price_state.Month == 8)]
    
    useful_cols = ['Entidad', 'Year', 'Month', 'Gas87', 'Gas91', 'Diesel', 'latitude', 'longitude']
    
    price_state_2 = price_state[useful_cols]
    
    # Function that TRANSFORM dataframe to GEOJSON:
    def df_to_geojson(df, properties, lat='latitude', lon='longitude'):
        """
        Turn a dataframe containing point data into a geojson formatted python dictionary
    
        df : the dataframe to convert to geojson
        properties : a list of columns in the dataframe to turn into geojson feature properties
        lat : the name of the column in the dataframe that contains latitude data
        lon : the name of the column in the dataframe that contains longitude data
        """
    
        # create a new python dict to contain our geojson data, using geojson format
        geojson = {'type':'FeatureCollection', 'features':[]}

        # loop through each row in the dataframe and convert each row to geojson format
        for _, row in df.iterrows():
            # create a feature template to fill in
            feature = {'type':'Feature',
                   'properties':{},
                   'geometry':{'type':'Point',
                               'coordinates':[]}}

            # fill in the coordinates
            feature['geometry']['coordinates'] = [row[lon],row[lat]]

            # for each column, get the value and add it as a new feature property
            for prop in properties:
                feature['properties'][prop] = row[prop]
        
            # add this feature (aka, converted dataframe row) to the list of features inside our dict
            geojson['features'].append(feature)
    
        return geojson
    
    # Retunn GEOJSON:
    useful_columns = ['Entidad', 'Year', 'Month', 'Gas87', 'Gas91', 'Diesel']
    geojson_dict = df_to_geojson(price_state_2, properties = useful_columns)
    
    return geojson_dict


#################################################

@app.route("/api/v1.0/price_time_serie")
def price_time():
    # Create oconnection from Python to the DB
    #connection_string = "postgres:postgres@localhost:5432/Gas_Price_MX"

    #engine = create_engine(f'postgresql://{connection_string}')

    """Return average prices times series"""
    # Query all station and prices
    price_time_serie = pd.read_sql_query('select * from price_time_serie', con=engine)

    # Transformations if it is necessary
    # MORE CODE HERE
    
    #
    
    #price_time_serie_li = list(np.ravel(price_time_serie))
    #return jsonify(price_time_serie_li)
    
    return price_time_serie.to_json(orient='table', date_format = 'iso', index = False)

#################################################

if __name__ == '__main__':
    app.run(debug=True)
