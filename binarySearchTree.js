const prettyPrint = require("./prettyPrint");

class Node {
  constructor(value = null, left = null, right = null) {
    this.value = value;
    this.left = left;
    this.right = right;
  }
}

class BinarySearchTree {
  constructor() {
    this.root = null;
  }

  buildTree(array) {
    let sortedArray = array.slice().sort((a, b) => a - b);
    let noDuplicatesArray = sortedArray.filter(
      (value, index, self) => self.indexOf(value) === index
    );
    this.root = this._buildRecursive(noDuplicatesArray);
  }

  _buildRecursive(sortedArray) {
    if (sortedArray.length === 0) {
      return null;
    } else if (sortedArray.length === 1) {
      return new Node(sortedArray[0]);
    }
    const midPoint = Math.floor(sortedArray.length / 2);
    const left = sortedArray.slice(0, midPoint);
    const right = sortedArray.slice(midPoint + 1, sortedArray.length);

    let currentNode = new Node(sortedArray[midPoint]);
    currentNode.left = this._buildRecursive(left);
    currentNode.right = this._buildRecursive(right);

    return currentNode;
  }

  insert(value) {
    let currentNode = this.root;
    while (!this._canInsert(value, currentNode)) {
      if (value > currentNode.value) {
        currentNode = currentNode.right;
      } else if (value < currentNode.value) {
        currentNode = currentNode.left;
      }
    }
    const insertSide = this._canInsert(value, currentNode);
    if (insertSide === "right") {
      currentNode.right = new Node(value);
    } else if (insertSide === "left") {
      currentNode.left = new Node(value);
    } else if (insertSide === "duplicate") {
      return;
    }
  }

  _canInsert(value, node) {
    if (value === node.value) {
      return "duplicate";
    } else if (value > node.value && node.right === null) {
      return "right";
    } else if (value < node.value && node.left === null) {
      return "left";
    }
  }

  _deleteLeaf(parent, lastRight) {
    if (lastRight) {
      parent.right = null;
    } else {
      parent.left = null;
    }
  }

  _deleteSingleChildNode(currentNode, parent, lastRight) {
    let child;
    if (currentNode.left) {
      child = currentNode.left;
    } else if (currentNode.right) {
      child = currentNode.right;
    }
    if (lastRight) {
      parent.right = child;
    } else if (!lastRight) {
      parent.left = child;
    }
  }

  _deleteDualChildNode(currentNode, parent, lastRight) {
    currentNode.left.right = currentNode.right;
    if (lastRight) {
      parent.right = currentNode.left;
    } else if (!lastRight) {
      parent.left = currentNode.left;
    }
  }

  _deleteRecursive(node, value) {
    if (node === null) {
      return null;
    }

    if (value < node.value) {
      node.left = this._deleteRecursive(node.left, value);
    } else if (value > node.value) {
      node.right = this._deleteRecursive(node.right, value);
    } else {
      if (node.left === null) {
        return node.right;
      } else if (node.right === null) {
        return node.left;
      }

      let successor = node.right;
      while (successor.left !== null) {
        successor = successor.left;
      }

      node.value = successor.value;
      node.right = this._deleteRecursive(node.right, successor.value);
    }
    return node;
  }

  _deleteRoot(currentNode) {
    // root has no children
    if (currentNode.left === null && currentNode.right === null) {
      this.root = null;
    }
    // root has one child
    else if (currentNode.left === null) {
      this.root = currentNode.right;
    } else if (currentNode.right === null) {
      this.root = currentNode.left;
    }
    // root has both children
    else {
      let successor = currentNode.right;
      while (successor.left !== null) {
        successor = successor.left;
      }
      this.root.value = successor.value;
      this.root.right = this._deleteRecursive(this.root.right, successor.value);
    }
  }

  delete(value) {
    let currentNode = this.root;
    let parent = this.root;
    let lastRight = false;

    while (true) {
      if (value > currentNode.value) {
        parent = currentNode;
        lastRight = true;
        currentNode = currentNode.right;
      } else if (value < currentNode.value) {
        parent = currentNode;
        lastRight = false;
        currentNode = currentNode.left;
      } else if (currentNode.value === value) {
        break;
      } else {
        break;
      }
    }

    if (currentNode.value === value && currentNode !== parent) {
      if (currentNode.left === null && currentNode.right === null) {
        this._deleteLeaf(parent, lastRight);
      } else if (
        // why no logical xor js ;_;
        (currentNode.left !== null || currentNode.right !== null) &&
        !(currentNode.left !== null && currentNode.right !== null)
      ) {
        this._deleteSingleChildNode(currentNode, parent, lastRight);
      } else if (currentNode.left !== null && currentNode.right !== null) {
        this._deleteDualChildNode(currentNode, parent, lastRight);
      }
    } else if (currentNode.value === value && currentNode === parent) {
      this._deleteRoot(currentNode);
    }
  }

  find(value) {
    let currentNode = this.root;
    while (currentNode !== null) {
      if (value === currentNode.value) {
        return currentNode;
      } else if (value > currentNode.value) {
        currentNode = currentNode.right;
      } else if (value < currentNode.value) {
        currentNode = currentNode.left;
      }
    }
  }

  levelOrder(func) {
    let queue = [this.root];
    let currentNode;
    let resArray = [];

    while (queue.length > 0) {
      currentNode = queue.shift();
      resArray.push(currentNode.value);
      if (currentNode.left !== null) {
        queue.push(currentNode.left);
      }
      if (currentNode.right !== null) {
        queue.push(currentNode.right);
      }
      if (typeof func === "function") {
        func(currentNode);
      }
    }
    if (typeof func !== "function") {
      return resArray;
    }
  }

  inOrder(func) {
    const stack = [];
    const resArray = [];
    let currentNode = this.root;

    while (currentNode !== null || stack.length > 0) {
      while (currentNode !== null) {
        stack.push(currentNode);
        currentNode = currentNode.left;
      }
      currentNode = stack.pop();
      if (typeof func === "function") {
        func(currentNode);
      } else {
        resArray.push(currentNode.value);
      }
      currentNode = currentNode.right;
    }
    if (typeof func !== "function") {
      return resArray;
    }
  }
}

// const testArray = [1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324];
const testArray = [1, 2, 3, 4, 5, 6, 7];

function test(node) {
  node.value = node.value / 2;
}

let tree = new BinarySearchTree();
tree.buildTree(testArray);

console.log(tree.inOrder());
tree.inOrder(test);

prettyPrint(tree.root);
