import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.GregorianCalendar;

public class test {
  public static void main(String[] args){
    SimpleDateFormat f = new SimpleDateFormat("Y YY YYY YYYY YYYYY");

    Date d = new Date("2021/01/01 08:06:10");

    GregorianCalendar c = new GregorianCalendar();
    c.setTime(d);
    c.setFirstDayOfWeek(GregorianCalendar.MONDAY);
    c.setMinimalDaysInFirstWeek(4);

    System.out.println(c.getWeeksInWeekYear());
    System.out.println(c.getWeekYear());
    System.out.println(f.format(d));
  }//End of main
}//End of FirstJavaProgram Class
