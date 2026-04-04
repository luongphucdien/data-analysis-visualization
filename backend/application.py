import logging
import os
from flask import Flask, jsonify, abort
from flask_caching import Cache
from flask_cors import CORS
import pandas as pd
from typing import Literal
from dotenv import load_dotenv

load_dotenv()

from settings import Config

application = Flask(__name__)
application.config.from_object(Config)
cache = Cache(app=application)
cors = CORS(application, resources={r"/*": {"origins": application.config["ALLOWED_ORIGINS"]}})

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def prepare_dataset():
    try:
        dataset = pd.read_csv(application.config["DATASET_PATH"])
        drop_cols = ["UOM_ID", "SCALAR_FACTOR", "SCALAR_ID", "VECTOR", "SYMBOL", "TERMINATED", "DECIMALS"]
        dataset["VALUE"] = pd.to_numeric(dataset["VALUE"], errors="coerce")
        dataset.drop(labels=drop_cols, axis="columns", inplace=True)
        dataset = dataset[~(dataset.STATUS == "F")].copy()
        cache.set("dataset", dataset, timeout=0)
        logger.info("Dataset prepared and cached successfully.")
        return dataset
    except FileNotFoundError:
        logger.error("Dataset file not found.")
        return None
    except Exception as e:
        logger.error(f"Error preparing dataset: {e}")
        return None

def get_dataset() -> pd.DataFrame:
    dataset = cache.get("dataset")
    if dataset is None:
        dataset = prepare_dataset()
    if dataset is None:
        abort(503, description="Dataset unavailable")
    return dataset

with application.app_context():
    prepare_dataset()

@application.route("/", methods=["GET"])
def test():
    return "Success", 200

@application.route("/persons", methods=["GET"])
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

    health = overall_health[overall_health["Overall health"].str.match(f"^Self-perceived {type}")].copy()
    health["Overall health"] = health["Overall health"].str.replace(f"Self-perceived {type} health, ", "").str.rstrip()

    table = health.pivot_table(index=["Indigenous identity", "Overall health"], columns=["Age group"], values="VALUE")

    drop_age = ["25 to 54 years"]
    drop_identity = ["First Nations (North American Indian), Registered or Treaty Indian",
                    "First Nations (North American Indian), not a Registered or Treaty Indian"]
    table.drop(columns=drop_age, index=drop_identity, inplace=True)

    return table

@application.route("/health", methods=["GET"])
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

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    application.run(host='0.0.0.0', port=port)