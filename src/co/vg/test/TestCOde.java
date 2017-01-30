package co.vg.test;

public class TestCOde {

	
	public static void main(String[] args) {
		
		
		String number = "1.200,1";
	
		String splitNum[]  = number.split(",");
		
		System.out.println(splitNum[0]);
		
		String finalV = splitNum[0].replace(".","");
	System.out.println(finalV);
	
	}
}
