
var EverestApp = EverestApp || {};

EverestApp.constants = {
	EXPENSE_DATA_SERVICE : "http://1-dot-leafy-future-156809.appspot.com/testgoogleappengineproject",
	SHEET_LINK : "https://docs.google.com/spreadsheets/d/1SDSWns1FicuWnTNXhOAPyRLbc1MqSVjrvuTjViB7Zmo/edit#gid=1913890961"
}

EverestApp.flags = {
	loadGraphOnload : true
}

$(document).ready(function() {
	EverestApp.initializeChartConfig();
	if(EverestApp.flags.loadGraphOnload) EverestApp.refreshChart()
	else EverestApp.renderChart(false,true);
})

EverestApp.initializeChartConfig = function(){
	/*CanvasJS.addCultureInfo("nl",{
        decimalSeparator: ".",
        digitGroupSeparator: ","
   });*/
	EverestApp.chart = new CanvasJS.Chart("chartContainer",{
		culture : "nl",	
		animationEnabled: true,
		animationDuration: 2000,
      	title:{
     	 	text: "Expense Developments"
      	},
       	data: [{
        	type: "line",
        	dataPoints: []
      	}]
    });
}

EverestApp.renderChart = function(data,onload){
	if(onload && !EverestApp.chart){
		EverestApp.chart = new CanvasJS.Chart("chartContainer",{
			culture : "nl",
			animationEnabled: true, 
			animationDuration: 2000,
			axisY:{
			   valueFormatString: "#,##.##",
			},			
	      	title:{
	     	 	text: "Expense Developments"
	      	},
	       	data: [{
	        	type: "line",
	        	dataPoints: data
	      	}]
	    });
	}else{
		EverestApp.chart.options.data[0].dataPoints = data;
	}
	EverestApp.chart.render();
}

EverestApp.openSpreadSheet = function(){
	window.open(EverestApp.constants.SHEET_LINK,"_blank")
}

EverestApp.refreshChart = function(){
	EverestApp.getExpenseData({},
		function(data){
			var result = getArrayFromObject(data);
			EverestApp.renderChart(result);
		},
		function(jqXHR, textStatus){
			 console.log( "Request failed: " + textStatus );
		}
	)
	console.log('refreshChart');	
}

EverestApp.getExpenseData = function(params,successCallback,errCallback){
	var request = $.ajax({
	  url: EverestApp.constants.EXPENSE_DATA_SERVICE,
	  method: "GET",
	  dataType: "json"
	});
	 
	request.done(function(data) {
		successCallback && successCallback(data)
	});
	 
	request.fail(function( jqXHR, textStatus) {
	 	errCallback && errCallback(jqXHR, textStatus);
	});
}

EverestApp.submitData = function(){
	var PersonalCost = $("#PersonalCost").val();
	var waterDischarge = $("#waterDischarge").val();
	var serviceOperation = $("#serviceOperation").val();
	var managementAccounting = $("#managementAccounting").val();
	var contingency = $("#contingency").val();
	var inflation = $("#inflation").val();
	var insurances = $("#insurances").val();
	$("#confirmbtn").text("Sending...");
	var timeout = 1300;
	var request = $.ajax({
	  url: EverestApp.constants.EXPENSE_DATA_SERVICE,
	  method: "GET",
	  data : {
	  	personalCost : PersonalCost,
		waterDischarge : waterDischarge,
		serviceOperation : serviceOperation,
		managementAccounting : managementAccounting,
		contingency : contingency,insurances:insurances,
		inflation : inflation
	  },
	  dataType: "json"
	});

	request.done(function(data) {
		$("#confirmbtn").html("Confirm")
		$('#notify-success').show();
		setTimeout(function(){
		$('#notify-success').hide();
		},timeout)
	});
	 
	request.fail(function( jqXHR, textStatus) {
		$("#confirmbtn").html("Confirm")
		$('#notify-err').show()
		setTimeout(function(){
		$('#notify-err').hide();
		},timeout)
	 	
	});
}

function getArrayFromObject(obj){
	var result = [];
	for(key in obj){
		var newObj = {};
		newObj["x"] = new Date(key);
		newObj["y"] = parseFloat(obj[key]);
		result.push(newObj); 
	}
	return result;
}
