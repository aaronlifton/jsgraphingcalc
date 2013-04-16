"use strict";
/*jslint browser:true */

function fun1(x) { return Math.sin(x);  }
function fun2(x) { return Math.cos(3 * x); }
function fun3(x) { return Math.sin(2 * x); }
function fun4(x) { return x * 2; }

function showAxes(ctx, axes) {
    var x0 = axes.x0,  w = ctx.canvas.width,
        y0 = axes.y0,  h = ctx.canvas.height,
		xmin = axes.doNegativeX ? 0 : x0;
    ctx.beginPath();
    ctx.strokeStyle = "rgb(128,128,128)";
    ctx.moveTo(xmin, y0); // X axis
	ctx.lineTo(w, y0);    // X axis
    ctx.moveTo(x0, 0);    // Y axis
	ctx.lineTo(x0, h);    // Y axis
    ctx.stroke();
}

function draw() {
    var canvas, axes, ctx;
	canvas = document.getElementById("canvas");
    if (null === canvas || !canvas.getContext) {
	    return;
    }
    axes = {};
	ctx = canvas.getContext("2d");
    axes.x0 = .5 + .5*canvas.width;  // x0 pixels from left to x=0
    axes.y0 = .5 + .5*canvas.height; // y0 pixels from top to y=0
    axes.scale = 80;                 // 40 pixels from x=0 to x=1
    axes.doNegativeX = true;
    showAxes(ctx, axes);
    funGraph(ctx, axes,fun1,"rgb(11,153,11)",1);
    funGraph(ctx, axes,fun2,"rgb(66,44,255)",2);
	funGraph(ctx, axes, fun4, "rgb(255,51,51)", 3);
}

function drawFn(funX,color,clear) {
 if (clear == null) clear=true;
 var canvas = document.getElementById("canvas");
 if (null==canvas || !canvas.getContext) return;

 var axes={}, ctx=canvas.getContext("2d");
 if (clear) {
 	ctx.clearRect (0,0,canvas.width,canvas.height);
 }
 
 axes.x0 = .5 + .5*canvas.width;  // x0 pixels from left to x=0
 axes.y0 = .5 + .5*canvas.height; // y0 pixels from top to y=0
 axes.scale = 80;                 // 40 pixels from x=0 to x=1
 axes.doNegativeX = true;
 showAxes(ctx,axes);
 return [ctx,axes,funX,color,1];
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

function genFn(part) {	
	// pow
	var inputFn = [];
    var re1='([0-9]|x)';	// Any Single Character 1
 	var re2='(\\^)';	// Any Single Character 2
 	var re3='(\\d+)';	// Integer Number 1
	var r = new RegExp(re1+re2+re3,["i"]);
	var match = r.exec(part);
	if(match != null && match.length > 0) {
		if(match[3] !== null) {
			// inputFn.push("Math.pow(x,"+power+")");
			var rr = part.replace(r, "Math.pow(" + match[1] +","+match[3]+")");
			inputFn.push(rr)
		}
	}
	
	// func(x+1)
    var pre='((?:[a-z][a-z]+))';
    var parens='(\\((.*?)\\))';
    r = new RegExp(pre+parens,["i"]);
	match = r.exec(part);
	if (match != null) {
		var rr = part.replace(r, "Math."+match[1]+"("+match[3]+")");
		inputFn.push(rr);
		console.log(match.join(" "));
	}
	
	// fallback to part
	if (inputFn.length == 0){
		inputFn.push(part);
	}
	
	return inputFn.join(" ")
}

function constructFn() {
	var input = $("#userFn").val();
	var fnxs = input.split(",");
	var ci = 0;
	var c = $('#color').children("option");
	for(var i=0;i<c.length;i++) {
		if ($(c[i]).is(":selected")) {
			ci=i;
		}
	}
	if (fnxs.length > 1) {
		clear();
		for (var i=0; i<fnxs.length;i++) {
			if (ci >= c.length) ci = 0;
			var fn = fnxs[i].split(" ").map(genFn).join(" ");
			var f = new Function("x	", 	"return " + fn);
			var cc = $(c[ci]).val();
			console.log(cc);
			funGraph.apply(null,drawFn(f, cc, false));
			ci ++;
		}
		return fnxs.join(", ");
	} else {
		var fn = input.split(" ").map(genFn).join(" ");
		var f = new Function("x	", 	"return " + fn);
		var cc = $(c[ci]).val();
		funGraph.apply(null,drawFn(f, cc));
		return fn;	
	}
}

$(document).ready(function() {
	$("#userFnSubmit").on("click", function() {
		constructFn();
	});
	
	$("#reset").on("click", function() {
		var c = $('#color').children("option").filter(":selected").val()
		$("#userFn").val("sin(2*x)");
		funGraph.apply(null, drawFn(fun3, c));
	})
	
	$('#userFn').keypress(function (e) {
	  if (e.which == 13) {
    	e.preventDefault();
	    $('#userFnSubmit').click();
	  }
	});
	
	$("#f1").html($("#userFn").val());
	$("#color").on('change',function(e) {
		$('#userFnSubmit').click();		
	});
	
	$(function () {
        var $react1, a1, f1;
        $react1 = $(".fn.reactive");
        if ($R !== null) {
            a1 = $R.state().bindToInput($("#userFn"), function (v) { return v; });
            f1 = $R(function (x) {
            	var c = constructFn();
            	return c;
            }).bindTo(a1);
            $R.dom($react1.find("#f1")).bindAttributeTo("innerHTML", f1);
        }
    });
    
    $(window).on("resize", function () {
       	var ctx = canvas.getContext("2d");
       	var w = $(window).width();
       	var h = $(window).height();
       	var f;
       	if(w < 1002) {
	        ctx.canvas.width = $(window).width()-10;
	    }
        if(h < 502) {
	        ctx.canvas.height = $(window).height()-10;
	    }
	    if(w < 1002 || h < 5012) {
	    	constructFn();
	    }
    });
    

});
