# -*- coding: utf-8 -*-
"""Untitled3.ipynb

Automatically generated by Colab.

Original file is located at
    https://colab.research.google.com/drive/1PUBK7UnA2vn9a6wMplv4e0XkL5_1zPPC
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.preprocessing import MinMaxScaler
from sklearn.linear_model import Ridge

num_months = int(input("Enter the number of Days you have data for: "))
user_data = []

for i in range(num_months):
    amount = float(input(f"Enter expense for day {i+1}: "))
    user_data.append(amount)

user_df = pd.DataFrame({'Amount': user_data})
user_df['Day'] = range(1, num_months + 1)

for lag in range(1, 4):
    user_df[f'Lag_{lag}'] = user_df['Amount'].shift(lag)

user_df = user_df.fillna(0)

scaler = MinMaxScaler()
X_user_scaled = scaler.fit_transform(user_df.drop(columns=['Amount']))

ridge_model = Ridge(alpha=1.0)
ridge_model.fit(X_user_scaled, user_df['Amount'])

future_months = np.arange(num_months + 1, num_months + 7)
future_df = pd.DataFrame({'Day': future_months})

for lag in range(1, 4):
    future_df[f'Lag_{lag}'] = [user_df['Amount'].iloc[-lag]] * len(future_df)

future_scaled = scaler.transform(future_df)
future_expenses = ridge_model.predict(future_scaled)

future_expenses = np.maximum(future_expenses, 0)  # Apply ReLU (convert negatives to zero)
future_expenses = np.round(future_expenses, 2)

plt.figure(figsize=(10, 5))
plt.plot(future_months, future_expenses, marker='o', linestyle='-', color='green', label='Predicted Expenses')
plt.xlabel("Days")
plt.ylabel("Predicted Expense")
plt.title("Expense Forecast (Next 6 Days)")
plt.xticks(future_months)
plt.legend()
plt.grid(True)
plt.show()

print("Predicted expenses for the next 6 days:", future_expenses)