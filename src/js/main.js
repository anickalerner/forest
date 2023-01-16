"use strict";
exports.__esModule = true;
require("../scss/styles.scss");
var bootstrap = require("bootstrap");
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
        this.trees = [];
        for (var x = 0; x < this.height; x++) {
            this.trees[x] = [];
            for (var y = 0; y < this.width; y++) {
                this.trees[x][y] = null;
            }
        }
    }
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
            x: Math.floor(Math.random() * this.width),
            y: Math.floor(Math.random() * this.height)
        };
    };
    Forest.prototype.tryPlantTree = function (name, color, texture) {
        var placeFound = false;
        while (!placeFound) {
            var coords = this.getRandomCoords();
            if (!this.trees[coords.x][coords.y]) {
                this.trees[coords.x][coords.y] = new Tree(coords, name, color, texture);
                placeFound = true;
            }
        }
    };
    Forest.prototype.plantBunchOfTrees = function (texture) {
        var emptySlots = Math.min(this.checkEmptySlots(), 50);
        var treesToPlant = 0;
        console.log('Empty slots: ', emptySlots);
        if (emptySlots > 0) {
            var treesToPlant_1 = this.getTreeSelectionSize(emptySlots);
            console.log('Planting ', treesToPlant_1, ' trees');
            for (var index = 0; index < treesToPlant_1; index++) {
                this.tryPlantTree('oak', 'green', texture);
            }
            this.draw();
        }
        return treesToPlant;
    };
    Forest.prototype.getTreeSelectionSize = function (emptySlots) {
        var size = 0;
        while (size === 0) {
            size = (emptySlots === 1) ? 1 : Math.floor(Math.random() * emptySlots);
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
    var plantedTrees = forest.plantBunchOfTrees(e.target);
    if (plantedTrees === 0) {
        var toastLiveExample = document.getElementById('liveToast');
        var toast = new bootstrap.Toast(toastLiveExample);
        toast.show();
    }
}
var forest = new Forest(10, 10);
var trees = document.getElementsByClassName('treeIcon');
for (var i = 0; i < trees.length; i++) {
    trees[i].addEventListener('click', function (e) { return placeTree(e, forest); });
}
