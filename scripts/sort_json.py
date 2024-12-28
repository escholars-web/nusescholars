import json
from collections import defaultdict
"""
Sort database of Descholars by
-> admit year
    -> major
        -> name
            -> personal details
"""

input_file = "../public/data/database.json"
output_file = "../public/data/sorted_database.json"

# Load the JSON data
with open(input_file, "r") as f:
    data = json.load(f)

# Step 1: Sort by name within the JSON
sorted_data = sorted(data.items(), key=lambda x: x[0])

# Step 2: Group by admit_year, then sort by major
organized_data = defaultdict(lambda: defaultdict(list))

for name, details in sorted_data:
    admit_year = details["admit_year"]
    major = details["major"] if details["major"] else "No Major"

    # Group by admit_year and major
    organized_data[admit_year][major].append({name: details})

# Step 3: Convert to a sorted structure for readability
final_structure = {}
for admit_year in sorted(organized_data.keys()):  # Sort by admit_year
    final_structure[admit_year] = {}
    for major in sorted(organized_data[admit_year].keys()):  # Sort by major
        final_structure[admit_year][major] = organized_data[admit_year][major]

# Step 4: Save the sorted JSON to a file
with open(output_file, "w") as f:  # Replace 'sorted_output.json' with your desired output JSON file name
    json.dump(final_structure, f, indent=4)

print("JSON data has been sorted and saved!")
