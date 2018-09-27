const AST = require('idyll-ast');
const fs = require('fs-extra');

let attrsToCheck = ['src', 'url'];
let pathToCheck = 'media/';
let destDir = 'build';

const modifyNodesByCondition = function (ast, condition, modifier) {
    const handleNode = (node) => {
        if (typeof node === 'string') {
            return node;
        }
        let result = condition(node);
        if (result === true) {
            node = modifier(node);
        }
        node = AST.modifyChildren(node, handleNode);
        return node;
    }
    ast = ast.map((node) => {
        return handleNode(node);
    });
    return ast;
};

const checkAttrs = function (attr) {
    let present = false;
    attrsToCheck.forEach((attrToCheck) => {
        if (attr[0] === attrToCheck)
            present = true;
    })
    return present;
}

const includesMediaInPath = function (node) {
    var result = false;
    if (node.length >= 2) {
        if (Array.isArray(node[1])) {
            node[1].forEach((attr) => {
                if (attr.length >= 2 && checkAttrs(attr) && attr[1].length >= 2) {
                    if (attr[1][1].includes(pathToCheck)) {
                        result = true;
                    }
                }
            });
        }
    }
    return result;
}

const replaceMediaInPath = function (node) {
    if (node.length >= 2) {
        if (Array.isArray(node[1])) {
            node[1].forEach((attr) => {
                if (attr.length >= 2 && checkAttrs(attr) && attr[1].length >= 2) {
                    let src = attr[1][1];
                    if (src.includes(pathToCheck)) {
                        let dst = destDir + '/' + attr[1][1];
                        console.log('Copying ' + src + ' to ' + dst);
                        fs.copy(src, dst, err => {
                            if (err && err.syscall !== 'unlink')
                                return console.error('Managing media assets error', err);
                            console.log('Copied ' + src + ' to ' + dst);
                        })
                    }
                }
            });
        }
    }
    return node;
}

module.exports = (ast) => {
    var timeBegin = process.hrtime();
    console.log('Managing media assets...');
    let newAST = modifyNodesByCondition(ast, includesMediaInPath, replaceMediaInPath);
    var timeEnd = process.hrtime(timeBegin);
    var timeTaken = parseFloat(timeEnd[0]) + parseFloat(timeEnd[1]) / Math.pow(10, 9);
    console.log('Managing media assets done in %f seconds', timeTaken);
    return newAST;
};