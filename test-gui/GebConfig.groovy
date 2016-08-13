@Grab(group="org.seleniumhq.selenium", module="selenium-chrome-driver", version="2.53.1")
import org.openqa.selenium.chrome.ChromeDriver
@Grab(group="org.seleniumhq.selenium", module="selenium-firefox-driver", version="2.53.1")
import org.openqa.selenium.firefox.FirefoxDriver
//@Grab(group='com.github.detro.ghostdriver', module='phantomjsdriver', version='1.0.1')
//import org.openqa.selenium.phantomjs.PhantomJSDriver

waiting {
    timeout = 2
}

environments {

    // run via “./gradlew chromeTest”
    // See: http://code.google.com/p/selenium/wiki/ChromeDriver
    chrome {
        driver = { new ChromeDriver() }
    }

    // run via “./gradlew firefoxTest”
    // See: http://code.google.com/p/selenium/wiki/FirefoxDriver
    firefox {
        driver = { new FirefoxDriver() }
    }

 //   phantomJs {
   //     driver = { new PhantomJSDriver() }
    //}

}

// To run the tests with all browsers just run “./gradlew test”

baseUrl = "http://gebish.org"
reportsDir = "report"