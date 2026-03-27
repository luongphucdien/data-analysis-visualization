from flask import Flask, jsonify
from flask_caching import Cache
from flask_cors import CORS, cross_origin
import pandas as pd

config = {
    "DEBUG": True,
    "CACHE_TYPE": "SimpleCache",
    "CACHE_DEFAULT_TIMEOUT": 3600
}
app = Flask(__name__)
app.config.from_mapping(config)
cache = Cache(app)
cors = CORS(app, resources={r"/*": {"origins": ["http://localhost:3000", "http://127.0.0.1:3000"]}})

def prepare_dataset():
    dataset = pd.read_csv("41100080.csv")
    drop_cols = ["UOM_ID", "SCALAR_FACTOR", "SCALAR_ID", "VECTOR", "SYMBOL", "TERMINATED", "DECIMALS"]
    dataset.drop(labels=drop_cols, axis="columns", inplace=True)
    dataset = dataset[~(dataset.STATUS == "F")]
    cache.set("dataset", dataset)
    return dataset

def get_dataset() -> pd.DataFrame:
    dataset = cache.get("dataset")
    if dataset is None:
        dataset = prepare_dataset()
    return dataset

@app.route("/", methods=["GET"])
def test():
    dataset = get_dataset()
    return jsonify(dataset.head().to_dict(orient="records")), 200

@app.route("/id_vs_gender", methods=["GET"])
def id_vs_gender_table():
    dataset = get_dataset()

    no_of_persons = dataset[dataset.Statistics == "Number of persons"]
    id_vs_gender = no_of_persons.pivot_table(index=["Indigenous identity"], columns=["Gender"],  values="VALUE")
    id_vs_gender = id_vs_gender.drop(index="Indigenous responses not included elsewhere")


    id_vs_gender_reset = id_vs_gender.reset_index().rename(columns={
        "Indigenous identity": "identity",
        "Men+": "men",
        "Women+": "women",
        "Total, gender": "total"
    })

    return jsonify(id_vs_gender_reset.fillna(0).to_dict(orient="records")), 200