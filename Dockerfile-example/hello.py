from flask import Flask

# Initialize the Flask application
app = Flask(__name__)

# Define the route for the home page
@app.route("/")
def home():
    return "Hello, World!"

# Define the route for the abnsila page
@app.route("/abnsila")
def abnsila():
    return "Hello, abnsila!"

# Run the local development server
if __name__ == "__main__":
    app.run(debug=False, host="0.0.0.0", port=5000)
