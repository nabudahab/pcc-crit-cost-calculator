//array of IDs of the input fields
var ids = ["fee", "cost", "start", "mar", "pp"/*At 4 AM have the sense of humour of an eight year old child*/];


//removes element with given id
function clear(id)
{
    if(document.getElementById("result") != null) document.getElementById("result").remove();
}

function outputResult(text)
{
    //Create output element to be appended to DOM
    var tag = document.createElement("p"); //element
    tag.id = "result"; //set id of paragraph to result
    var text = document.createTextNode(text); //text node
    tag.appendChild(text); //add text to paragraph tag
    document.body.appendChild(tag); //add paragraph tag to body
}

//Graph the first element against the second in the array
function graph(arr){
    
}

//Solve for the only element of the array
function solveFor(arr){

    arr = arr[0]; //Convert single element array to variable
    var x = 0; //Numerical solution
    var inputs = {}; //takes numerical inputs from HTML document so I don't have to use document.getElementById every single time
    
    //Populate inputs dictionary
    ids.forEach(function(item, index){
        if(item != arr){
            inputs[item] = parseInt(document.getElementById(item).value);
        }
    });

    console.log(inputs);

    //Check which variable is missing and solve for it
    if(arr == "mar"){
        x = inputs.fee*inputs.start - inputs.cost - inputs.pp; //Calculate the net profit/loss
        
        outputResult("Net Profit/Loss: " + x.toString() + " USD");
    }

    if(arr == "fee"){
        x = (inputs.mar + inputs.cost + inputs.pp)/inputs.start; //Calculate the race fees
        
        outputResult("Average race fees: " + x.toString() + " USD");
    }

    if(arr == "cost"){
        x = inputs.fee*inputs.start - inputs.mar - inputs.pp; //Calculate the expected cost (this is probably useless)

        outputResult("Expected costs: " + x.toString() + " USD");
    }

    if(arr == "start"){
        x = (inputs.mar + inputs.cost + inputs.pp)/inputs.fee; //Calculate the number of starters
        
        outputResult("Race starters: " + x.toString());
    }

    if(arr == "pp"){
        x = inputs.fee*inputs.start - inputs.mar - inputs.cost; //Calculate the expected cost (this is probably useless)
        
        outputResult("Prize pool size: " + x.toString() + " USD");
    }
}

//Button callback function
function solve(){
    clear("result");
    //Array of empty inputs
    var empty = [];

    //Loop through inputs, calculate number of empty ones
    for(var i = 0; i < ids.length; i++){ 
        if(document.getElementById(ids[i]).value.length == 0) empty.push(ids[i]);
    }

    //Alert user if less than three inputs are filled out
    if(empty.length > 2){
        outputResult("Too few inputs. At least 3 inputs allowed.");
    }
    else if(empty.length == 2) graph(empty);
    else if(empty.length == 1) solveFor(empty);
    //Alert user if more than four inputs are filled out
    else{
        outputResult("Too many inputs. At most 4 inputs allowed.");
    }
}