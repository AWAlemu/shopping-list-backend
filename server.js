var express = require('express');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var Storage = function() {
    this.items = [];
    this.id = 0;
};

Storage.prototype.add = function(name) {
    var item = {name: name, id: this.id};
    this.items.push(item);
    this.id += 1;
    return item;
};

Storage.prototype.delete = function(id) {
    var i = 0;
    for (var i = 0; i < this.items.length; i++) {
        if (this.items[i].id == id) {
            break;
        } else if (i == this.items.length - 1) {
            i == null;
        }
    }
    var temp = this.items.splice(i, 1);
    return temp.length;
};

Storage.prototype.edit = function(id, name) {
    for (var i = 0; i < this.items.length; i++) {
        var edited = false;
        if(this.items[i].id == id) {
            this.items[i].name = name;
            edited = true;
            return this.items[i];
        }
        if (edited) {
            break;
        }
        else if(i == this.items.length - 1){
            var item = {name: name, id: id};
            this.items.push(item);
            return item;
        }
    }
};
var storage = new Storage();
storage.add('Broad beans');
storage.add('Tomatoes');
storage.add('Peppers');

var app = express();

app.use(express.static('public'));

app.get('/items', function(request, response) {
    response.json(storage.items);
});

app.post('/items', jsonParser, function(request, response) {
    if (!request._body) {
       return response.sendStatus(400);
    } 
    var item = storage.add(request.body.name);
    response.status(201).json(item);
    
});

app.delete('/items/:id', jsonParser, function(request, response) {
    if (!request.body) {
        return response.sendStatus(400);
    }
    var splicedLength = storage.delete(request.params.id);
    if (!splicedLength) {
        response.status(400).send({error: 'Delete request failed. ID not found'});
    }
    else {
        response.status(200).send();
    }
});
app.put('/items/:id', jsonParser, function(request, response) {
    if (!request.body) {
        return response.sendStatus(400);
    } else if (request.params.id != request.body.id) {
        return response.status(400).send({error: 'Edit request failed. ID in the request parameter and body doesn\'t match.'});
    }
    
    var item = null;
    item = storage.edit(request.body.id, request.body.name);

    if (item) {
        response.status(200).json(item);
    }
    else {
        response.status(400).send({error: 'Edit request failed. Request consists bad body or missing id.'});
    }
    
    
});
app.put('/items', jsonParser, function(request, response){
    if (!request.params.id) {
        return response.status(400).send({error: 'Edit request failed. Route doesn\'t contain id'});
    }
});

app.delete('/items', jsonParser, function(request, response) {
    if (!request.params.id) {
        return response.status(400).send({error: 'Delete request failed. Route doesn\'t contain id'});
    }
});
app.listen(process.env.PORT, process.env.IP);

exports.app = app;
exports.storage = storage;
