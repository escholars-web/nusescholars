import os
import json
import shutil

# Function to convert a name into kebab-case
def to_kebab_case(name):
    parts = name.lower().split()
    return '-'.join(parts)

# Function to create directories inside a parent directory and copy template files
def process_json_and_copy_files(json_file, template_dir, parent_dir):
    # Read the JSON data
    with open(json_file, 'r') as f:
        data = json.load(f)
    
    # Create the parent directory if it doesn't exist already
    os.makedirs(parent_dir, exist_ok=True)
    
    # Loop through each entry in the JSON
    for name, details in data.items():
        # Convert name to kebab-case
        directory_name = to_kebab_case(name)

        # Full path of the new directory within the parent directory
        full_directory_path = os.path.join(parent_dir, directory_name)

        # Create the directory (if it doesn't exist already)
        os.makedirs(full_directory_path, exist_ok=True)

        # Copy template files to the new directory
        for filename in os.listdir(template_dir):
            template_file = os.path.join(template_dir, filename)
            if os.path.isfile(template_file):
                shutil.copy(template_file, full_directory_path)

        print(f"Processed directory for {name} at {full_directory_path}/")

# File paths
json_file = "./public/data/database.json"  # Path to the JSON file
template_dir = "./src/app/humans-of-descholars/template"  # Path to the template directory
parent_dir = "./src/app/humans-of-descholars"  # Path to the parent directory where all subdirectories will be created

# Run the function
process_json_and_copy_files(json_file, template_dir, parent_dir)
