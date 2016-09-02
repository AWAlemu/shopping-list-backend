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
    for (var i = 0; i < this.items.length; i++) {
        if(this.items[i].id == id) {
            var temp = this.items.splice(i, 1);
            return temp.lengh; 
        }
    }
};

Storage.prototype.edit = function(id, name) {
  for (var i = 0; i < this.items.length; i++) {
      if(this.items[i].id == id) {
          this.items[i].name = name;
          return true;
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
    if (!request.body) {
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
    if (splicedLength == 0) {
        var error = 'Item not found';
        response.json(error);
    }
    else {
        response.status(200);
    }
});
app.put('/items/:id', jsonParser, function(request, response) {
    if (!request.body) {
        return response.sendStatus(400);
    }
    var edit = false;
    if (request.params.id == request.body.id) {
        edit = storage.edit(request.params.id, request.body.name);
    }
    if (edit) {
        response.status(200);
    }
    else {
        var error = 'Edit request failed. Request consists bad body or missing id.';
        response.json(error);
    }
    
});
app.listen(process.env.PORT, process.env.IP);
