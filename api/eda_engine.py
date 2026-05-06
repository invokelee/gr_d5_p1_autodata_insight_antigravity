import pandas as pd
import io
import numpy as np

def analyze_csv(csv_text: str) -> dict:
    df = pd.read_csv(io.StringIO(csv_text))
    
    # 1. Basic Stats
    num_rows = len(df)
    num_cols = len(df.columns)
    
    numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
    categorical_cols = df.select_dtypes(exclude=[np.number]).columns.tolist()
    
    missing_values = df.isnull().sum().to_dict()
    
    # 2. Variable Distributions (for Recharts)
    distributions = {}
    
    # Numeric Distributions (Histograms)
    for col in numeric_cols:
        # Avoid huge categorical-like numeric columns if unique values are small
        if df[col].nunique() < 10:
            counts = df[col].value_counts(dropna=False).to_dict()
            distributions[col] = {"type": "categorical_numeric", "data": [{"name": str(k), "value": v} for k, v in counts.items()]}
        else:
            # Create ~10 bins for histogram
            counts, bin_edges = np.histogram(df[col].dropna(), bins=10)
            hist_data = []
            for i in range(len(counts)):
                # Bin label like "10.5 - 20.5"
                label = f"{bin_edges[i]:.1f} - {bin_edges[i+1]:.1f}"
                hist_data.append({"name": label, "value": int(counts[i])})
            distributions[col] = {"type": "numeric", "data": hist_data}
            
    # Categorical Distributions (Bar/Pie)
    for col in categorical_cols:
        counts = df[col].value_counts(dropna=False).head(10).to_dict()
        distributions[col] = {"type": "categorical", "data": [{"name": str(k), "value": v} for k, v in counts.items()]}
        
    # 3. Correlation Matrix for Numeric cols (for Scatter/Heatmap ideas)
    correlation_data = []
    if len(numeric_cols) > 1:
        corr_matrix = df[numeric_cols].corr().replace({np.nan: 0})
        for i, col1 in enumerate(numeric_cols):
            row_data = {"name": col1}
            for j, col2 in enumerate(numeric_cols):
                row_data[col2] = round(corr_matrix.loc[col1, col2], 3)
            correlation_data.append(row_data)

    # 4. Data Preview
    preview = df.head(5).replace({np.nan: None}).to_dict(orient='records')
    
    # 5. Full Summary
    summary = {
        "dataset_info": {
            "num_rows": num_rows,
            "num_cols": num_cols,
            "numeric_columns": numeric_cols,
            "categorical_columns": categorical_cols
        },
        "missing_values": {k: v for k, v in missing_values.items() if v > 0},
        "distributions": distributions,
        "correlation": correlation_data,
        "preview": preview,
        "columns": df.columns.tolist()
    }
    
    # We also send raw data for frontend scatter plots if needed (downsampled to 100 rows to save payload size)
    if len(numeric_cols) >= 2:
        scatter_sample = df[numeric_cols].dropna().sample(min(100, len(df.dropna(subset=numeric_cols)))).to_dict(orient='records')
        summary["scatter_sample"] = scatter_sample
    else:
        summary["scatter_sample"] = []

    return summary
