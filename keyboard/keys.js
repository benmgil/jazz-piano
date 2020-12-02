function leftKey(x){
    let val = '<polygon id="" class="key white" points="';
    val += x+",0 ";
    val += (x+10)+",0 ";
    val += (x+10)+",50 ";
    val += (x+15)+",50 ";
    val += (x+15)+",100 ";
    val += x+',100"/>';
    console.log(val);
}

function blackKey(x){
    let val = '<polygon id="" class="key black" points="';
    val += x+",0 ";
    val += (x+10)+",0 ";
    val += (x+10)+",50 ";
    val += x+',50"/>';
    console.log(val);
}


function midKey(x){
    let val = '<polygon id="" class="key white" points="';
    val += x+",0 ";
    val += (x+5)+",0 ";
    val += (x+5)+",50 ";
    val += (x+10)+",50 ";
    val += (x+10)+",100 ";
    val += (x-5)+",100 ";
    val += (x-5)+",50 ";
    val += (x)+',50"/>';
    console.log(val);
}

function rightKey(x){
    let val = '<polygon id="" class="key white" points="';
    val += x+",0 ";
    val += (x+10)+",0 ";
    val += (x+10)+",100 ";
    val += (x-5)+",100 ";
    val += (x-5)+",50 ";
    val += (x)+',50"/>';
    console.log(val);
}