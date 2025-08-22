#!/bin/bash

# Set Flask environment variables
export FLASK_APP=flaskr
export FLASK_ENV=development
export FLASK_DEBUG=1

# Run Flask app
python3 -m flask run
