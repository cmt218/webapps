/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

prev = "0";
cur = "0";
op = 0;
isDecimal = false;
var stack = new Array();

function calClear() {
    stack = [];
    cur = "0";
    document.getElementById('display').value = cur;
    isDecimal = false;
}

function numPress(num) {
    if(eval(cur) === 0){
        cur = num;
    }
    else {
        cur = cur + num;
    }
    document.getElementById('display').value = cur;
}document.getElementById('display').value = cur;

function push() {
    stack.push(cur);
    cur = "0";
    document.getElementById('display').value = cur;
    isDecimal = false;
}

function add() {
    var first = eval(stack.pop());
    var second = eval(stack.pop());
    var result = first + second;
    stack.push(result);
    cur = "0";
    document.getElementById('display').value = result;
    isDecimal = false;
}

function subtract() {
    var first = eval(stack.pop());
    var second = eval(stack.pop());
    var result = second - first;
    stack.push(result);
    cur = "0";
    document.getElementById('display').value = result;
    isDecimal = false;
}

function multiply() {
    var first = eval(stack.pop());
    var second = eval(stack.pop());
    var result = second * first;
    stack.push(result);
    cur = "0";
    document.getElementById('display').value = result;
    isDecimal = false;
}

function divide() {
    var first = eval(stack.pop());
    var second = eval(stack.pop());
    var result = second / first;
    stack.push(result);
    cur = "0";
    document.getElementById('display').value = result;
    isDecimal = false;
}

function appendDec() {
    if(isDecimal === false){
        cur = cur + ".";
    }
    isDecimal = true;
    document.getElementById('display').value = cur;
}

function posNeg() {
    cur = cur - (cur*2);
    document.getElementById('display').value = cur;
}