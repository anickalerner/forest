"use strict";
exports.__esModule = true;
require("../scss/styles.scss");
var bootstrap_1 = require("bootstrap");
var lodash_1 = require("lodash");
var TreeType = /** @class */ (function () {
    function TreeType(p_name, p_color, p_texture) {
        this.name = p_name;
        this.color = p_color;
        this.texture = p_texture;
    }
    TreeType.prototype.draw = function (context, x, y) {
        context.drawImage(this.texture, 50 * x, 50 * y, 50, 50);
    };
    return TreeType;
}());
var TreeFactory = /** @class */ (function () {
    function TreeFactory() {
    }
    TreeFactory.getTreeType = function (name, color, texture) {
        var ind = this.treeTypes.findIndex(function (tt, i) { return (tt.name === name && tt.color === color && tt.texture === texture); });
        if (ind < 0) {
            this.treeTypes.push(new TreeType(name, color, texture));
            ind = -1;
        }
        return this.treeTypes.at(ind);
    };
    TreeFactory.treeTypes = new Array();
    return TreeFactory;
}());
var Tree = /** @class */ (function () {
    function Tree(coords, name, color, texture) {
        this.coords = coords;
        this.type = TreeFactory.getTreeType(name, color, texture);
    }
    Tree.prototype.draw = function (context) {
        this.type.draw(context, this.coords.x, this.coords.y);
    };
    return Tree;
}());
var Forest = /** @class */ (function () {
    function Forest(w, h) {
        this.width = w;
        this.height = h;
        this.initTrees();
    }
    Forest.prototype.initTrees = function () {
        this.trees = [];
        for (var x = 0; x < this.height; x++) {
            this.trees[x] = [];
            for (var y = 0; y < this.width; y++) {
                this.trees[x][y] = null;
            }
        }
    };
    Forest.prototype.reset = function () {
        this.initTrees();
        this.clearForest();
    };
    Forest.prototype.clearForest = function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    };
    Forest.prototype.checkEmptySlots = function () {
        var filled = 0;
        for (var y = 0; y < this.height; y++) {
            for (var x = 0; x < this.width; x++) {
                if (this.trees[y][x]) {
                    filled++;
                }
            }
        }
        return (this.width * this.height - filled);
    };
    Forest.prototype.getRandomCoords = function () {
        return {
            x: (0, lodash_1.floor)((0, lodash_1.random)(0, this.width - 1)),
            y: (0, lodash_1.floor)((0, lodash_1.random)(0, this.height - 1))
        };
    };
    Forest.prototype.tryPlantTree = function (name, color, texture) {
        var placeFound = false;
        while (!placeFound) {
            var coords = this.getRandomCoords();
            if (!this.trees[coords.y][coords.x]) {
                this.trees[coords.y][coords.x] = new Tree(coords, name, color, texture);
                placeFound = true;
            }
        }
    };
    Forest.prototype.plantBunchOfTrees = function (texture) {
        var emptySlots = this.checkEmptySlots();
        var treesToPlant = 0;
        console.log('Empty slots: ', emptySlots);
        if (emptySlots > 0) {
            var maxSlots = (0, lodash_1.min)([emptySlots, (this.width * this.height) / 2]);
            treesToPlant = this.getTreeSelectionSize(maxSlots);
            console.log('Planting ', treesToPlant, ' trees');
            for (var index = 0; index < treesToPlant; index++) {
                this.tryPlantTree('oak', 'green', texture);
            }
            this.draw();
        }
    };
    Forest.prototype.isFull = function () {
        return this.checkEmptySlots() === 0;
    };
    Forest.prototype.getTreeSelectionSize = function (emptySlots) {
        var size = 0;
        while (size === 0) {
            size = (emptySlots === 1) ? 1 : (0, lodash_1.floor)((0, lodash_1.random)(0, emptySlots));
        }
        return size;
    };
    Forest.prototype.draw = function () {
        this.canvas = document.getElementById("forest");
        this.context = this.canvas.getContext("2d");
        for (var y = 0; y < this.height; y++) {
            for (var x = 0; x < this.width; x++) {
                if (this.trees[y][x]) {
                    this.trees[y][x].draw(this.context);
                }
            }
        }
    };
    return Forest;
}());
function placeTree(e, forest) {
    forest.plantBunchOfTrees(e.target);
    if (forest.isFull()) {
        var clearButton_1 = document.getElementById('clear-forest');
        clearButton_1.classList.remove('d-none');
        clearButton_1.addEventListener('click', function () {
            forest.reset();
            clearButton_1.classList.add('d-none');
        });
        showFullForestMessage();
    }
}
function showFullForestMessage() {
    var toastLiveExample = document.getElementById('liveToast');
    var toast = new bootstrap_1.Toast(toastLiveExample);
    toast.show();
}
var forest = new Forest(10, 10);
var trees = document.getElementsByClassName('treeIcon');
for (var i = 0; i < trees.length; i++) {
    trees[i].addEventListener('click', function (e) { return placeTree(e, forest); });
}
