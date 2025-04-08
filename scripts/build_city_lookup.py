import pandas as pd
import json

# Load world cities data
cities = pd.read_csv("../public/data/worldcities.csv")

# Round lat/lon to 1 decimal and drop duplicates
cities['lat_rounded'] = cities['lat'].round(1)
cities['lng_rounded'] = cities['lng'].round(1)

# Keep only necessary columns
cities = cities[['lat_rounded', 'lng_rounded', 'city_ascii', 'country']]

# Drop duplicates to avoid ambiguity
cities = cities.drop_duplicates(subset=['lat_rounded', 'lng_rounded'])

# Build dictionary
mapping = {
    f"{row.lat_rounded},{row.lng_rounded}": f"{row.city_ascii}, {row.country}"
    for _, row in cities.iterrows()
}

# Save to JSON
with open("../public/data/latlng_to_city.json", "w") as f:
    json.dump(mapping, f)

print(f"✅ Saved lat/lng → city lookup with {len(mapping)} entries")
