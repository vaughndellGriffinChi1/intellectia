from http.server import SimpleHTTPRequestHandler, HTTPServer
import sqlite3
import json
from urllib.parse import parse_qs
import os
import hashlib

def init_db():
    conn = sqlite3.connect('website.db')
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS users
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                  username TEXT UNIQUE,
                  password TEXT)''')
    conn.commit()
    conn.close()

init_db()

class MyHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory='public', **kwargs)

    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length).decode('utf-8')
        fields = parse_qs(post_data)
        
        if self.path == '/register':
            username = fields.get('username', [''])[0]
            password = fields.get('password', [''])[0]
            
            hashed_password = hashlib.sha256(password.encode()).hexdigest()
            
            conn = sqlite3.connect('website.db')
            c = conn.cursor()
            try:
                c.execute("INSERT INTO users (username, password) VALUES (?, ?)", (username, hashed_password))
                conn.commit()
                response = {"status": "success", "message": "User registered successfully!"}
            except sqlite3.IntegrityError:
                response = {"status": "error", "message": "Username already exists!"}
            conn.close()
            
        elif self.path == '/login':
            username = fields.get('username', [''])[0]
            password = fields.get('password', [''])[0]
            
            hashed_password = hashlib.sha256(password.encode()).hexdigest()
            
            conn = sqlite3.connect('website.db')
            c = conn.cursor()
            c.execute("SELECT * FROM users WHERE username = ? AND password = ?", (username, hashed_password))
            user = c.fetchone()
            conn.close()
            
            if user:
                response = {"status": "success", "message": "Login successful!", "redirect": "/main.html"}
            else:
                response = {"status": "error", "message": "Invalid username or password!"}
        
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps(response).encode('utf-8'))

PORT = 8000
Handler = MyHandler

with HTTPServer(("", PORT), Handler) as httpd:
    print(f"Server running at http://localhost:{PORT}")
    httpd.serve_forever()