from flask import Flask, render_template, session, request
from flask_socketio import SocketIO, emit

socketio = SocketIO
app = Flask(__name__)
socketio = SocketIO(app, async_mode="threading")
print(socketio.async_mode)


@app.route("/")
def home():
    return render_template('index.html') #redirects to index.html in templates folder

@socketio.event
def connect(): #when socket connects, send data confirming connection
    socketio.emit('message_send', {'message': "Connected successfully!", 'current_user': "Temp User", 'user_number': "1"})


if __name__=='__main__':

    socketio.run(app)
