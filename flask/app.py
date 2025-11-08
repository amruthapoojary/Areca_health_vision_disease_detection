# D:\user\Amrutha023\arecanut-disease-detection\flask\app.py
from flask import Flask, request, jsonify
import os, time

app = Flask(__name__)
SAVE_DIR = r"D:\user\Amrutha023\arecanut-disease-detection\flask\images"
os.makedirs(SAVE_DIR, exist_ok=True)

@app.route('/upload', methods=['POST'])
def upload():
    data = request.get_data()
    if not data:
        return jsonify({'status':'no data'}), 400
    filename = os.path.join(SAVE_DIR, f"img_{int(time.time())}.jpg")
    try:
        with open(filename, 'wb') as f:
            f.write(data)
        return jsonify({'status':'saved','path':filename}), 200
    except Exception as e:
        return jsonify({'status':'error','error':str(e)}), 500

if __name__ == '__main__':
    # Run on all interfaces so the ESP32 can reach it: http://<your-laptop-ip>:5003/upload
    app.run(host='0.0.0.0', port=5003, debug=False)
