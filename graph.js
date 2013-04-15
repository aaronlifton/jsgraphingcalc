function fun1(x) {return Math.sin(x);  }
function fun2(x) {return Math.cos(3*x);}
function fun3(x) {return Math.sin(2*x);}

function draw() {
 var canvas = document.getElementById("canvas");
 if (null==canvas || !canvas.getContext) return;

 var axes={}, ctx=canvas.getContext("2d");
 axes.x0 = .5 + .5*canvas.width;  // x0 pixels from left to x=0
 axes.y0 = .5 + .5*canvas.height; // y0 pixels from top to y=0
 axes.scale = 80;                 // 40 pixels from x=0 to x=1
 axes.doNegativeX = true;

 showAxes(ctx,axes);
 funGraph(ctx,axes,fun1,"rgb(11,153,11)",1); 
 funGraph(ctx,axes,fun2,"rgb(66,44,255)",2);
}

function drawFn(funX,color) {
 var canvas = document.getElementById("canvas");
 if (null==canvas || !canvas.getContext) return;

 var axes={}, ctx=canvas.getContext("2d");
 ctx.clearRect (0,0,canvas.width,canvas.height);
 
 axes.x0 = .5 + .5*canvas.width;  // x0 pixels from left to x=0
 axes.y0 = .5 + .5*canvas.height; // y0 pixels from top to y=0
 axes.scale = 80;                 // 40 pixels from x=0 to x=1
 axes.doNegativeX = true;
 showAxes(ctx,axes);
 funGraph(ctx,axes,funX,color,1);
}

function clear() {
 var canvas = document.getElementById("canvas");
 if (null==canvas || !canvas.getContext) return;
 var axes={}, ctx=canvas.getContext("2d");
 ctx.clearRect (0,0,canvas.width,canvas.height);
} 

function funGraph (ctx,axes,func,color,thick) {
 var xx, yy, dx=4, x0=axes.x0, y0=axes.y0, scale=axes.scale;
 var iMax = Math.round((ctx.canvas.width-x0)/dx);
 var iMin = axes.doNegativeX ? Math.round(-x0/dx) : 0;
 ctx.beginPath();
 // ctx.lineWidth = thick;
 ctx.strokeStyle = color;

 for (var i=iMin;i<=iMax;i++) {
  xx = dx*i; yy = scale*func(xx/scale);
  if (i==iMin) ctx.moveTo(x0+xx,y0-yy);
  else ctx.lineTo(x0+xx,y0-yy);
 }
 ctx.stroke();
}

function showAxes(ctx,axes) {
 var x0=axes.x0, w=ctx.canvas.width;
 var y0=axes.y0, h=ctx.canvas.height;
 var xmin = axes.doNegativeX ? 0 : x0;
 ctx.beginPath();
 ctx.strokeStyle = "rgb(128,128,128)"; 
 ctx.moveTo(xmin,y0); ctx.lineTo(w,y0);  // X axis
 ctx.moveTo(x0,0);    ctx.lineTo(x0,h);  // Y axis
 ctx.stroke();
}

function genFn(part) {	
	// pow
	var inputFn = [];
    var re1='([0-9]|x)';	// Any Single Character 1
 	var re2='(\\^)';	// Any Single Character 2
 	var re3='(\\d+)';	// Integer Number 1
	var r = new RegExp(re1+re2+re3,["i"]);
	var match = r.exec(part);
	if(match != null && match.length > 0) {
		power = match[3];
		// inputFn.push("Math.pow(x,"+power+")");
		var rr = part.replace(r, "Math.pow(" + match[1] +","+power+")");
		inputFn.push(rr)
	}
	
	// func(x+1)
    var re4='((?:[a-z][a-z]+))';	// Word 1
	
	// fallback to part
	if (inputFn.length == 0){
		inputFn.push(part);
	}
	
	return inputFn.join(" ")
}

function constructFn() {
	var input = $("#userFn").val();
	
	var fn = input.split(" ").map(genFn).join(" ");
	var f = new Function("x	", 	"return " + fn)
	
	var c = $('#color').children("option").filter(":selected").val()
	
	drawFn(f, c);
}

$(document).ready(function() {
	$("#userFnSubmit").on("click", function() {
		constructFn();
	});
	
	$("#test").on("click", function() {
		var c = $('#color').children("option").filter(":selected").val()
		drawFn(fun3, c);
	})
	
	$('#userFn').keypress(function (e) {
	  if (e.which == 13) {
    	e.preventDefault();
	    $('#userFnSubmit').click();
	  }
	});
});