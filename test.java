import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.TimeZone;

public class test {
  public static void main(String[] args){
    final SimpleDateFormat f = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss");
    f.setTimeZone(TimeZone.getTimeZone("UTC"));

    try {
      final java.util.Date dateObj = f.parse("2020-12-27T08:06:10");

      SimpleDateFormat f2 = new SimpleDateFormat("H HH HHH HHHH HHHHH k kk kkk kkkk kkkkk z ZZZZ");

      System.out.println(f2.format(dateObj));
    }
    catch (Exception e) {
    //The handling for the code
    }
  }//End of main
}//End of FirstJavaProgram Class
