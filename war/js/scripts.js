
var EverestApp = EverestApp || {};

EverestApp.constants = {
	EXPENSE_DATA_SERVICE : "http://1-dot-leafy-future-156809.appspot.com/testgoogleappengineproject",
	
	SHEET_LINK : "https://docs.google.com/spreadsheets/d/1SDSWns1FicuWnTNXhOAPyRLbc1MqSVjrvuTjViB7Zmo/edit#gid=1913890961"
}

EverestApp.flags = {
	loadGraphOnload : true
}

$(document).ready(function() {
	 $('[data-toggle="tooltip"]').tooltip();   
	EverestApp.initializeChartConfig();
	if(EverestApp.flags.loadGraphOnload) EverestApp.refreshChart()
	else EverestApp.renderChart(false,true);
	EverestApp.initData();
})

EverestApp.initializeChartConfig = function(){
	/*CanvasJS.addCultureInfo("nl",{
        decimalSeparator: ".",
        digitGroupSeparator: ","
   });*/
	EverestApp.chart = new CanvasJS.Chart("chartContainer",{

		animationEnabled: true,
		animationDuration: 1500,
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
	//if(onload && !EverestApp.chart){
		EverestApp.chart = new CanvasJS.Chart("chartContainer",{
			
			animationEnabled: true, 
			animationDuration: 1500,
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
	//}else{
		EverestApp.chart.options.data[0].dataPoints = data;
	//}
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
	  data : {
		  
		   Operation:'read'
			   
	  },			   
	  dataType: "json"
	});
	 
	request.done(function(data) {
		successCallback && successCallback(data)
	});
	 
	request.fail(function( jqXHR, textStatus) {
	 	errCallback && errCallback(jqXHR, textStatus);
	});
}

EverestApp.initData= function(){
	
	var request = $.ajax({
		  url: EverestApp.constants.EXPENSE_DATA_SERVICE,
		  method: "GET",
		  data : {
			  
		   Operation:'init',
		  	
		  },
		  dataType: "json"
		});
	request.done(function(data) {
		populateForm(data);
	});
}
EverestApp.generateReport = function(){
	
	

	var canvas = $("#chartContainer .canvasjs-chart-canvas").get(0);
	var dataURL = canvas.toDataURL();
	console.log(dataURL);
	
	var pdf = new jsPDF();
	
	//pdf.line(20, 25, 60, 25);
	pdf.addImage(dataURL, 'JPEG', 0, 0);
	pdf.line(0, 110, 300, 110);
	
	pdf.setFontSize(25);
	pdf.text(0,120,"Project Input Data:");
	
	pdf.setFontSize(15);
	pdf.setFont('courier')
	pdf.setFontType('normal')

	pdf.text(20,135,"Personal Cost:"+$("#PersonalCost").val());
	pdf.text(20,145,"Water Discharge:"+$("#waterDischarge").val());
	pdf.text(20,155,"Service Operation:"+$("#serviceOperation").val());
	pdf.text(20,165,"Management Accounting:"+$("#managementAccounting").val());
	
	pdf.save("Everest Energy Report.pdf");
	
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
		  
	   Operation:'write',
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
		EverestApp.refreshChart();
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
function populateForm(obj){
	
	$("#PersonalCost").val(obj[0].value);
	$("#waterDischarge").val(obj[1].value);
	$("#serviceOperation").val(obj[2].value);
	$("#managementAccounting").val(obj[3].value);
	$("#insurances").val(obj[4].value);
	$("#contingency").val(obj[5].value);
	$("#inflation").val(obj[6].value);
	
	
	/*var result = [];
	for(value in obj){
		var newObj = {};
		newObj["x"] =value;
		//newObj["y"] = parseFloat(obj[key]);
		result.push(newObj); 
	}
	return result;
	*/
}
