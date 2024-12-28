import pandas as pd
import json

def excel_to_json(excel_file, json_file):
    # Read the Excel file into a pandas DataFrame
    df = pd.read_excel(excel_file)

    # Drop rows where "writeup" is empty or contains NaN
    df = df[df["writeup"].notna() & (df["writeup"].str.strip() != "")]

    # Replace NaN or empty strings with None (which converts to null in JSON)
    df = df.where(pd.notna(df), None)
    df = df.applymap(lambda x: None if isinstance(x, str) and x.strip() == "" else x)

    # Set "name" as the index for the JSON structure
    df = df.set_index("name")

    # Convert the DataFrame to a dictionary (JSON-like structure)
    json_data = df.to_dict(orient='index')

    # Save the JSON data to a file
    with open(json_file, 'w') as f:
        json.dump(json_data, f, indent=4)

    print(f"Successfully converted {excel_file} to {json_file} with 'name' as the identifier and null values for missing entries")

# File paths
excel_file = "data.xlsx"  # Replace with your Excel file path
json_file = "./public/data/database.json"   # Replace with your desired JSON file path

# Convert the file
excel_to_json(excel_file, json_file)
