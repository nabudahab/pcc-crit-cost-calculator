const functionPlot = window.functionPlot;

//array of IDs of the input fields
var ids = ["fee", "cost", "start", "mar", "pp"/*At 4 AM have the sense of humour of an eight year old child*/];


//removes element with given id
function clear(id) {
	if (document.getElementById("result") != null) document.getElementById("result").remove();
}

function outputResult(text) {
	//insert the text var into an existing div with id result
	var result = document.getElementById("result");
	result.innerHTML = text;
}

//Graph the first element against the second in the array
function graph(arr) {
	mar = parseInt(document.getElementById("mar").value);
	fee = parseInt(document.getElementById("fee").value);
	cost = parseInt(document.getElementById("cost").value);
	start = parseInt(document.getElementById("start").value);
	pp = parseInt(document.getElementById("pp").value);

	if (arr.includes("fee") && arr.includes("cost")) {
		//Plot fee vs cost
		m = start;
		b = -(mar + pp);
		draw("x*" + m.toString() + "+" + b.toString(), "Expected Cost", "Race Fees");
	}

	if (arr.includes("fee") && arr.includes("start")) {
		//Plot fee vs start
		formula = "(" + mar.toString() + "+" + cost.toString() + "+" + pp.toString() + ")/x";
		draw(formula, "Race Fees", "Number of Starters");
	}

	if (arr.includes("fee") && arr.includes("mar")) {
		//Plot mar/start + (cost + pp)/start vs fee
		m = start;
		b = -(cost + pp);
		draw("x*" + m.toString() + "+" + b.toString(), "Profit Margin", "Race Fees");
	}

	if (arr.includes("fee") && arr.includes("pp")) {
		//Plot pp/start + (mar + cost)/start vs fee
		m = start;
		b = -(mar + cost);
		draw("x*" + m.toString() + "+" + b.toString(), "Prize Pool", "Race Fees");
	}

	if (arr.includes("cost") && arr.includes("start")) {
		//Plot (mar + fee + pp)/start vs cost
		m = fee;
		b = -(mar + pp);
		draw("x*" + m.toString() + "+" + b.toString(), "Expected Cost", "Number of Starters");
	}

	if (arr.includes("cost") && arr.includes("mar")) {
		//Plot mar/start + fee/start vs cost
		m = 1 / start;
		b = fee / start;
		draw("x*" + m.toString() + "+" + b.toString(), "Expected Cost", "Profit Margin");
	}

	if (arr.includes("cost") && arr.includes("pp")) {
		//Plot pp/start + fee/start vs cost
		m = 1 / start;
		b = fee / start;
		draw("x*" + m.toString() + "+" + b.toString(), "Expected Cost", "Prize Pool");
	}

	if (arr.includes("start") && arr.includes("mar")) {
		//Plot mar/cost + fee/cost vs start
		m = fee;
		b = -(cost + pp);
		draw("x*" + m.toString() + "+" + b.toString(), "Number of Starters", "Profit Margin");
	}

	if (arr.includes("start") && arr.includes("pp")) {
		//Plot pp/cost + fee/cost vs start
		m = fee;
		b = -(cost + mar);
		draw("x*" + m.toString() + "+" + b.toString(), "Number of Starters", "Prize Pool");
	}
	
	if (arr.includes("mar") && arr.includes("pp")) {
		//Plot margin vs prize pool
		m = -1;
		b = fee*start - cost;
		draw("x*" + m.toString() + "+" + b.toString(), "Profit Margin", "Prize Pool");
	}
}

//Solve for the only element of the array
function solveFor(arr) {
	arr = arr[0]; //Convert single element array to variable
	var x = 0; //Numerical solution
	var inputs = {}; //takes numerical inputs from HTML document so I don't have to use document.getElementById every single time

	//Populate inputs dictionary
	ids.forEach(function (item, index) {
		if (item != arr) {
			inputs[item] = parseInt(document.getElementById(item).value);
		}
	});

	//Check which variable is missing and solve for it
	if (arr == "mar") {
		x = inputs.fee * inputs.start - inputs.cost - inputs.pp; //Calculate the net profit/loss

		outputResult("Net Profit/Loss: " + x.toString() + " USD");
	}

	if (arr == "fee") {
		x = (inputs.mar + inputs.cost + inputs.pp) / inputs.start; //Calculate the race fees

		outputResult("Average race fees: " + x.toString() + " USD");
	}

	if (arr == "cost") {
		x = inputs.fee * inputs.start - inputs.mar - inputs.pp; //Calculate the expected cost (this is probably useless)

		outputResult("Expected costs: " + x.toString() + " USD");
	}

	if (arr == "start") {
		x = (inputs.mar + inputs.cost + inputs.pp) / inputs.fee; //Calculate the number of starters

		outputResult("Race starters: " + x.toString());
	}

	if (arr == "pp") {
		x = inputs.fee * inputs.start - inputs.mar - inputs.cost; //Calculate the expected cost (this is probably useless)

		outputResult("Prize pool size: " + x.toString() + " USD");
	}
}

//Button callback function
function solve() {
	//empty the result div
	outputResult("");

	//Array of empty inputs
	var empty = [];

	//Loop through inputs, calculate number of empty ones
	for (var i = 0; i < ids.length; i++) {
		if (document.getElementById(ids[i]).value.length == 0) empty.push(ids[i]);
	}

	//Alert user if less than three inputs are filled out
	if (empty.length > 2) {
		outputResult("Too few inputs. At least 3 inputs allowed.");
	}
	else if (empty.length == 2) graph(empty);
	else if (empty.length == 1) solveFor(empty);
	//Alert user if more than four inputs are filled out
	else {
		outputResult("Too many inputs. At most 4 inputs allowed.");
	}
}

//Draw the given function using plotly
function draw(formula, xname, yname) {
	try {
		// compile the expression once
		const expression = formula;
		const expr = math.compile(expression)
  
		// evaluate the expression repeatedly for different values of x
		const xValues = math.range(-100, 1000, 1).toArray()
		const yValues = xValues.map(function (x) {
		  return expr.evaluate({x: x})
		})
  
		// render the plot using plotly, make the line red
		const trace1 = {
		  x: xValues,
		  y: yValues,
		  type: 'scatter',
		  marker: {color: 'red'},
		}
		const data = [trace1]
		Plotly.newPlot('plot', data)

		//change axis names to xname and yname and set the x range from -100 to 1000
		if (xname != undefined) {
			Plotly.relayout('plot', {
				xaxis: {
					title: xname
				},
			});
		}	

		if (yname != undefined) {
			Plotly.relayout('plot', {
				yaxis: {
					title: yname
				}
			});
		}

		//Set the plot background color to the same as the page background color
		Plotly.relayout('plot', {
			plot_bgcolor: "#f2f2f2",
			paper_bgcolor: "#f2f2f2"
		});

	  }
	  catch (err) {
		console.error(err)
		alert(err)
	  }
}

draw("");