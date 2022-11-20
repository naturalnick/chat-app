from flask import Flask, render_template
from dotenv import load_dotenv

app = Flask(__name__, static_folder="../client/build/static", template_folder="../client/build")

@app.route("/")
def index():
    return render_template("index.html"), 200

if __name__=="__main__":
	app.run(debug=True)