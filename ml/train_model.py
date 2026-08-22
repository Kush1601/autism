import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
import joblib
import os

def train():
    # Load data
    csv_path = '../Autism-Child-Data.csv'
    if not os.path.exists(csv_path):
        csv_path = '../../Autism-Child-Data.csv'
    
    if not os.path.exists(csv_path):
        print(f"Error: CSV file not found at {csv_path}")
        return

    df = pd.read_csv(csv_path)

    # Handle missing values ('?')
    df = df.replace('?', pd.NA)

    # Features mapping
    df['gender'] = df['gender'].map({'m': 0, 'f': 1})
    df['jundice'] = df['jundice'].map({'no': 0, 'yes': 1})
    df['austim'] = df['austim'].map({'no': 0, 'yes': 1})
    df['Class/ASD'] = df['Class/ASD'].map({'NO': 0, 'YES': 1})

    features = ['A1_Score', 'A2_Score', 'A3_Score', 'A4_Score', 'A5_Score',
                'A6_Score', 'A7_Score', 'A8_Score', 'A9_Score', 'A10_Score',
                'age', 'gender', 'jundice', 'austim']

    X = df[features]
    y = df['Class/ASD']

    # Convert all to numeric (handles '?' turned NA)
    X = X.apply(pd.to_numeric, errors='coerce')
    
    # Fill NaNs with 0 or mean/mode
    X = X.fillna(X.median())
    y = y.fillna(0)

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)

    # Save model
    joblib.dump(model, 'autism_model.pkl')
    accuracy = model.score(X_test, y_test)
    print(f"Model trained and saved as 'autism_model.pkl'")
    print(f"Test Accuracy: {accuracy:.4f}")

if __name__ == "__main__":
    train()
