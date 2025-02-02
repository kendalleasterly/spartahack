import csv
import json
import sys
import random

def correct_gender(gender):
    """
    If the gender is 'non-binary' (case-insensitive), there is a 75% chance to convert it to 'male'.
    Otherwise, returns the original gender.
    """
    if gender.lower() == "non-binary":
        if random.random() < 0.75:
            return "male"
    return gender

def convert_csv_to_json(input_csv_path, output_json_path):
    """
    Reads a CSV file where each row represents a barber.
    It converts the "hairstyles" field (a comma-separated string) into an array of strings,
    converts the "will-travel" field into a boolean,
    and if the gender is 'non-binary', it changes it to 'male' 75% of the time.
    Adds an 'example_images' property with an empty array and a 'profile_image' property with an empty string.
    Finally, it outputs the data to a JSON file.
    """
    barbers = []
    
    with open(input_csv_path, newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            # Convert 'hairstyles' into a list of strings
            if 'hairstyles' in row:
                row['hairstyles'] = [style.strip() for style in row['hairstyles'].split(',')]
            
            # Convert 'will-travel' into a boolean
            if 'will-travel' in row:
                value = row['will-travel'].strip().upper()
                row['will-travel'] = True if value == 'TRUE' else False
            
            # Apply the gender correction if necessary
            if 'gender' in row:
                row['gender'] = correct_gender(row['gender'])
            
            # Optional: Convert 'rating' and 'cost' to appropriate numeric types.
            if 'rating' in row:
                try:
                    row['rating'] = float(row['rating'])
                except ValueError:
                    pass
                    
            if 'cost' in row:
                try:
                    row['cost'] = float(row['cost'])
                except ValueError:
                    pass
            
            # Add 'example_images' property with an empty array
            row['example_images'] = []
            
            # Add 'profile_image' property with an empty string
            row['profile_image'] = ""
            
            barbers.append(row)
    
    # Write the processed data as JSON
    with open(output_json_path, 'w', encoding='utf-8') as jsonfile:
        json.dump(barbers, jsonfile, indent=2)
    
    print(f"Successfully converted '{input_csv_path}' to '{output_json_path}'.")

def main():
    if len(sys.argv) != 3:
        print("Usage: python msu_barbers_to_json.py input_csv_path output_json_path")
        sys.exit(1)
    
    input_csv_path = sys.argv[1]
    output_json_path = sys.argv[2]
    convert_csv_to_json(input_csv_path, output_json_path)

if __name__ == "__main__":
    main()