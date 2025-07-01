from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

API_KEY = os.getenv('Twelve_Data_API_Key')

@app.route('/stock')
def get_stock():
    symbol = request.args.get('symbol', '').upper()
    if not symbol:
        return jsonify({'error': 'No symbol provided.'}), 400
    url = f'https://api.twelvedata.com/time_series'
    params = {
        'symbol': symbol,
        'interval': '5min',
        'outputsize': 30,
        'apikey': API_KEY
    }
    r = requests.get(url, params=params)
    data = r.json()
    if 'values' not in data:
        return jsonify({'error': data.get('message', 'Invalid symbol or API error.')}), 400
    times = [v['datetime'] for v in reversed(data['values'])]
    prices = [float(v['close']) for v in reversed(data['values'])]
    return jsonify({'times': times, 'prices': prices})

if __name__ == '__main__':
    app.run(debug=True)
