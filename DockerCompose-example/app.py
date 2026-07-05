from flask import Flask
from redis import Redis, RedisError
import os

app = Flask(__name__)

# Connect to Redis using the host and port provided
# The 'redis' host name works if you are running this in a Docker container 
# connected to a container named 'redis' via a network.
redis = Redis(host='redis', port=6379, decode_responses=True)

@app.route('/')
def hello():
    try:
        # Increment the 'hits' counter in Redis
        count = redis.incr('hits')
    except RedisError:
        return "<h3>Redis connection failed!</h3>"

    return f"""
    <h1>Welcome to the Site!</h1>
    <p>This page has been visited <strong>{count}</strong> time(s).</p>
    <p><em>Monitoring system: Redis cache active at redis:6379</em></p>
    """

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
