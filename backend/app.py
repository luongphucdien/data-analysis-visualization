from flask import Flask, jsonify
from flask_caching import Cache
from flask_cors import CORS
import pandas as pd
from typing import Literal
from dotenv import load_dotenv
from settings import Config

load_dotenv()

app = Flask(__name__)
app.config.from_object(Config)
cache = Cache(app)
cors = CORS(app, resources={r"/*": {"origins": app.config["ALLOWED_ORIGINS"]}})

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

    drop_identity = ["First Nations (North American Indian), Registered or Treaty Indian",
                    "First Nations (North American Indian), not a Registered or Treaty Indian","Indigenous responses not included elsewhere"]
    
    id_vs_gender = id_vs_gender.drop(index=drop_identity)


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

    table = health.pivot_table(index=["Indigenous identity", "Overall health"], columns=["Age group"], values="VALUE")

    drop_age = ["25 to 54 years"]
    drop_identity = ["First Nations (North American Indian), Registered or Treaty Indian",
                    "First Nations (North American Indian), not a Registered or Treaty Indian"]
    table.drop(columns=drop_age, index=drop_identity, inplace=True)

    return table

@app.route("/health", methods=["GET"])
def general_health_table():
    dataset = get_dataset()

    table_general = overall_health_extractor(dataset, type="general")
    table_mental = overall_health_extractor(dataset, type="mental")

    table = pd.concat([table_general, table_mental], keys=["general", "mental"])
    age_map = {
        "15 to 24 years": "15_24",
        "25 to 34 years": "25_34",
        "35 to 44 years": "35_44",
        "45 to 54 years": "45_54",
        "55 years and over": "55_over",
        "Total, 15 years and over": "total"
    }
    table.rename(columns=age_map, inplace=True)

    table.index.names = ["type", "identity", "health_status"]
    table_flat = table.reset_index()

    grade_map = {
        "excellent": "A",
        "excellent or very good": "B_plus",
        "very good": "B",
        "good": "C",
        "fair or poor": "F"
    }
    table_flat["health_status"] = table_flat["health_status"].str.strip().map(grade_map)
    result = table_flat.to_dict(orient="records")

    return jsonify(result), 200