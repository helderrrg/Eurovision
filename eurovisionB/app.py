from flask import Flask, jsonify
from flask_cors import CORS 
from teste import extract_odds

app = Flask(__name__)
CORS(app)

@app.route('/api/odds', methods=['GET'])
def get_odds():
    odds = extract_odds()
    return jsonify(odds)

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)
