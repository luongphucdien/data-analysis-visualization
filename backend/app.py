from flask import Flask
import pandas as pd

app = Flask(__name__)

@app.route("/")
def test():
    dataset = pd.read_csv("41100080.csv")
    null_cols = dataset[dataset.isnull().columns].columns
    return null_cols.to_list()
