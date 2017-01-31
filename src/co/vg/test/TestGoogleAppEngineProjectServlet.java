package co.vg.test;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.api.client.extensions.appengine.http.UrlFetchTransport;
import com.google.api.client.googleapis.auth.oauth2.GoogleCredential;
import com.google.api.client.googleapis.extensions.appengine.auth.oauth2.AppIdentityCredential;
import com.google.api.client.http.HttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.services.sheets.v4.Sheets;
import com.google.api.services.sheets.v4.SheetsRequestInitializer;
import com.google.api.services.sheets.v4.SheetsScopes;
import com.google.api.services.sheets.v4.model.BatchGetValuesResponse;
import com.google.api.services.sheets.v4.model.ValueRange;
import com.google.appengine.labs.repackaged.org.json.JSONArray;
import com.google.appengine.labs.repackaged.org.json.JSONException;
import com.google.appengine.labs.repackaged.org.json.JSONObject;

@SuppressWarnings("serial")
public class TestGoogleAppEngineProjectServlet extends HttpServlet {
	public void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
		resp.setContentType("application/json");

		GoogleCredential credential = GoogleCredential.getApplicationDefault();



		String operation = req.getParameter("Operation");
		//resp.getWriter().write(operation);
		HttpTransport httpTransport = new UrlFetchTransport();
		JsonFactory jsonFactory = new JacksonFactory();

		

		if(operation.equals("read")){
			try {
				Sheets service = new Sheets.Builder(httpTransport, jsonFactory, null)
						.setApplicationName("")
						.setGoogleClientRequestInitializer(new SheetsRequestInitializer("AIzaSyBUzAhGs3SLD3c2I4rNfTQv4pauTnYiGA8")).build();
				ReadData(resp,service);
			} catch (JSONException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}else if(operation.equals("write")){
			Collection sheetScope = Collections.singletonList(SheetsScopes.DRIVE);

			AppIdentityCredential credentials =
					new AppIdentityCredential(sheetScope);


			Sheets service = getSheetsService(credentials, httpTransport, jsonFactory);
			String id = "1SDSWns1FicuWnTNXhOAPyRLbc1MqSVjrvuTjViB7Zmo";
			String writeRange1 = "Project Inputs!D12:D17";
			String writeRange2 = "Project Inputs!C20";


			String personalCost = req.getParameter("personalCost");
			String waterDischarge = req.getParameter("waterDischarge");
			String serviceMaintanenceAndOperation = req.getParameter("serviceOperation");
			String managementAccounting = req.getParameter("managementAccounting");
			String insurances = req.getParameter("insurances");
			String contingency = req.getParameter("contingency");
			String infaltion = req.getParameter("inflation");

			List<List<Object>> writeData = new ArrayList<>();

			List<Object> dataList = new ArrayList<>();
			dataList.add(personalCost);
			dataList.add(waterDischarge);
			dataList.add(serviceMaintanenceAndOperation);
			dataList.add(managementAccounting);
			dataList.add(insurances);
			dataList.add(contingency);
			//	dataList.add(infaltion);

			writeData.add(dataList);

			ValueRange vr = new ValueRange().setValues(writeData).setMajorDimension("COLUMNS");
			service.spreadsheets().values()
			.update(id, writeRange1, vr)
			.setValueInputOption("RAW")
			.execute();

			List<List<Object>> writeData2 = new ArrayList<>();
			List<Object> dataList2 = new ArrayList<>();
			dataList2.add(infaltion);
			writeData2.add(dataList2);

			ValueRange vr2 = new ValueRange().setValues(writeData2).setMajorDimension("COLUMNS");
			service.spreadsheets().values()
			.update(id, writeRange2, vr2)
			.setValueInputOption("RAW")
			.execute();
			
			JSONObject responseObject = new JSONObject();
			try {
				responseObject.put("Response", "Ok");
			} catch (JSONException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			resp.getWriter().write(responseObject.toString());
			


		}else if(operation.equals("init")){
			Sheets service = new Sheets.Builder(httpTransport, jsonFactory, null)
					.setApplicationName("")
					.setGoogleClientRequestInitializer(new SheetsRequestInitializer("AIzaSyBUzAhGs3SLD3c2I4rNfTQv4pauTnYiGA8")).build();
			
		//	Sheets service = getSheetsService(credentials, httpTransport, jsonFactory);
			String spreadsheetId = "1SDSWns1FicuWnTNXhOAPyRLbc1MqSVjrvuTjViB7Zmo";
			String writeRange1 = "Project Inputs!D12:D17";
			String writeRange2 = "Project Inputs!C20";
			
			
			List<String> ranges = new ArrayList<>();
			ranges.add(writeRange1);
			ranges.add(writeRange2);

			BatchGetValuesResponse response = service.spreadsheets().values()
					.batchGet(spreadsheetId).setRanges(ranges).setMajorDimension("COLUMNS").execute();

			List<String> yearList = new ArrayList<>();

			List<ValueRange> valuesResponse	 = response.getValueRanges();



			ValueRange valYear = valuesResponse.get(0);
			List<List<Object>> valuesYear = valYear.getValues();


			System.out.println(valuesYear.get(0).size());
			List<Object> rowsYear =  valuesYear.get(0);
			for(int j=0;j<valuesYear.get(0).size();j++){

				System.out.println(rowsYear.get(j));
				yearList.add(rowsYear.get(j).toString());
			}


			ValueRange valuesData = valuesResponse.get(1);
			List<List<Object>> valueData = valuesData.getValues();

			System.out.println(valueData.get(0).size());
			List<Object> rowsData =  valueData.get(0);
			for(int j=0;j<valueData.get(0).size();j++){

				yearList.add( rowsData.get(j).toString());
			}
			JSONArray ja = new JSONArray();
			
			System.out.println(valueData.size());
			for(int k=0;k<yearList.size();k++){

				try {
					JSONObject json = new JSONObject();
					json.put("value",yearList.get(k));
					ja.put(json);
				} catch (JSONException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}

			}
			System.out.println(ja.toString());
			resp.getWriter().write(ja.toString());
			
		}
	}
	public Sheets getSheetsService(AppIdentityCredential credentials,HttpTransport transport,JsonFactory factory){
		return new Sheets.Builder(transport, factory, credentials)
				.setApplicationName("leafy-future-156809")
				.build();
	}
	public static void ReadData(HttpServletResponse resp,Sheets service) throws IOException, JSONException{
		// Build a new authorized API client service.


		// Prints the names and majors of students in a sample spreadsheet:
		// https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
		String spreadsheetId = "1SDSWns1FicuWnTNXhOAPyRLbc1MqSVjrvuTjViB7Zmo";
		String range1 = "P&L!E7:L";
		String range2 = "P&L!E31:L";
		List<String> ranges = new ArrayList<>();
		ranges.add(range1);
		ranges.add(range2);

		BatchGetValuesResponse response = service.spreadsheets().values()
				.batchGet(spreadsheetId).setRanges(ranges).execute();

		List<String> yearList = new ArrayList<>();
		List<String> valueList = new ArrayList<>();

		List<ValueRange> valuesResponse	 = response.getValueRanges();



		ValueRange valYear = valuesResponse.get(0);
		List<List<Object>> valuesYear = valYear.getValues();

		System.out.println("Name, Major");
		System.out.println(valuesYear.get(0).size());
		List<Object> rowsYear =  valuesYear.get(0);
		for(int j=0;j<valuesYear.get(0).size();j++){

			System.out.println(rowsYear.get(j));
			yearList.add(rowsYear.get(j).toString());
		}



		ValueRange valuesData = valuesResponse.get(1);
		List<List<Object>> valueData = valuesData.getValues();

		System.out.println(valueData.get(0).size());
		List<Object> rowsData =  valueData.get(0);
		for(int j=0;j<valueData.get(0).size();j++){

			System.out.println(rowsData.get(j));
			String valyue = rowsData.get(j).toString();
			String arrayValue[] = valyue.split(",");
			String newValue = "";
			if(arrayValue[0]!=null)
				newValue = arrayValue[0].replace(".","");
			valueList.add(newValue);


		}
		JSONObject json = new JSONObject();
		System.out.println(valueData.size());
		for(int k=0;k<yearList.size();k++){

			json.put(yearList.get(k), valueList.get(k));

		}
		System.out.println(json.toString());
		resp.getWriter().write(json.toString());

	}
}
