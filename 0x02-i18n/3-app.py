#!/usr/bin/env python3
"""
3. Parametrize templates
"""
from flask_babel import Babel, _
from flask import Flask, render_template, request


app = Flask(__name__)
babel = Babel(app)


class Config:
    """
    Configuration class for setting up available languages and default
    locale/timezone for the Flask app
    """
    LANGUAGES = ["en", "fr"]
    BABEL_DEFAULT_LOCALE = 'en'
    BABEL_DEFAULT_TIMEZONE = 'UTC'


app.config.from_object(Config)


@babel.localeselector
def get_locale() -> str:
    """
    Determine the best match for the user's preferred language based on
    request headers
    """
    return request.accept_languages.best_match(app.config['LANGUAGES'])


@app.route('/')
def home() -> str:
    """
    Render the home page.
    """
    return render_template('3-index.html')


if __name__ == '__main__':
    app.run(debug=True)
