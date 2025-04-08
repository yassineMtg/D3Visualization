import numpy as np
import xarray as xr
import pandas as pd
import os

# === Configuration ===
INPUT_FILE = '../public/data/Land_and_Ocean_LatLong1.nc'
OUTPUT_DIR = '../public/data/chunks_quarters/'
os.makedirs(OUTPUT_DIR, exist_ok=True)

# === Load the dataset ===
ds = xr.open_dataset(INPUT_FILE)

# Convert Berkeley fractional year time to actual datetime
base_time = pd.Timestamp('1850-01-01')
time_values = base_time + pd.to_timedelta((ds.time.values - 1850) * 365.25, unit='D')
ds = ds.assign_coords(time=('time', time_values))

min_time, max_time = pd.to_datetime(time_values.min()), pd.to_datetime(time_values.max())
print(f"✅ Dataset covers: {min_time.date()} to {max_time.date()}")

# Generate 3-month intervals (quarters)
quarter_starts = pd.date_range(start=min_time, end=max_time, freq='3MS')  # Start of every 3rd month

for i in range(len(quarter_starts) - 1):
    start_date = quarter_starts[i]
    end_date = quarter_starts[i + 1] - pd.Timedelta(days=1)

    label = f"{start_date.year}_{start_date.month:02d}_to_{end_date.year}_{end_date.month:02d}"
    print(f"⏳ Chunking: {label}")

    subset = ds.sel(time=slice(start_date, end_date))
    df = subset[['temperature', 'climatology', 'land_mask']].to_dataframe().reset_index()

    # Filter valid land points
    df = df[df['land_mask'] == 1]
    df = df.dropna(subset=['temperature', 'climatology'])
    df = df.sort_values(by='time')

    out_path = os.path.join(OUTPUT_DIR, f"berkeley_{label}.csv")
    df.to_csv(out_path, index=False)
    print(f"✅ Saved: {out_path} ({len(df)} rows)")

print("🎉 Done generating 3-month chunks!")
