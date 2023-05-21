from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from bson.objectid import ObjectId


app = Flask(__name__)
app.config['MONGO_URI'] = 'mongodb+srv://shreyansh:tempandhumd@wtlab.d85wdmr.mongodb.net/todo?retryWrites=true&w=majority'
mongo = PyMongo(app)

@app.route('/api/todo', methods=['GET'])
def get_todos():
    todos = mongo.db.todos.find()
    return jsonify([{'_id': str(todo['_id']), 'name': todo['name']} for todo in todos])

@app.route('/api/todo', methods=['POST'])
def create_todo():
    name = request.json.get('name')
    todo = {'name': name}
    result = mongo.db.todos.insert_one(todo)
    todo['_id'] = str(result.inserted_id)
    return jsonify(todo)

@app.route('/api/todo/<id>', methods=['PUT'])
def update_todo(id):
    name = request.json.get('name')
    todo_id = ObjectId(id)
    mongo.db.todos.update_one({'_id': todo_id}, {'$set': {'name': name}})
    return jsonify({'message': 'Todo updated successfully'})

@app.route('/api/todo/<id>', methods=['DELETE'])
def delete_todo(id):
    mongo.db.todos.delete_one({'_id': ObjectId(id)})
    return jsonify({'message': 'Todo deleted successfully'})

if __name__ == '__main__':
    app.run(debug=True)
