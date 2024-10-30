namespace test;

public abstract class ApiBaseTest {
   public static HttpClient client = new HttpClient();
   public ApiBaseTest(){
        client.BaseAddress = new Uri(Config.UrlApi!);
   }
}