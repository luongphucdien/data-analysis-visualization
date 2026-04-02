from flask import Flask, jsonify, request
from flask_caching import Cache
from flask_cors import CORS, cross_origin
import pandas as pd
from typing import Literal

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

@app.route("/persons", methods=["GET"])
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

def overall_health_extractor(dataset: pd.DataFrame, type: Literal["general", "mental"]):
    overall_health = dataset[(dataset["Overall health"] != "Total, self-perceived general health") &
                            (dataset["Overall health"] != "Total, self-perceived mental health")]

    health = overall_health[overall_health["Overall health"].str.match(f"^Self-perceived {type}")]
    health["Overall health"] = health["Overall health"].str.replace(f"Self-perceived {type} health, ", "").str.rstrip()

    id_vs_health = health.pivot_table(index=["Indigenous identity"], columns=["Overall health"], values="VALUE")

    return id_vs_health

@app.route("/health", methods=["GET"])
def general_health_table():
    dataset = get_dataset()

    table_general = overall_health_extractor(dataset, type="general")
    table_mental = overall_health_extractor(dataset, type="mental")

    table = pd.concat([table_general, table_mental], keys=["general", "mental"])
    result = {}
    for category, group in table.groupby(level=0):
        records = group.reset_index(level=1).rename(columns={
            "Indigenous identity": "identity",
            "excellent": "A",
            "excellent or very good": "B_plus",
            "very good": "B",
            "good": "C",
            "fair or poor": "F" 
        }).to_dict(orient="records")
        result[category] = records

    return jsonify(result), 200
