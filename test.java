import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.GregorianCalendar;

public class test {
  public static void main(String[] args){
    SimpleDateFormat f = new SimpleDateFormat("w ww www wwww wwwww");

    Date d = new Date("2021/01/18 08:06:10");

    System.out.println(f.format(d));
  }//End of main
}//End of FirstJavaProgram Class
