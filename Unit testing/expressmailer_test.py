from selenium import webdriver
from selenium.webdriver.common.keys import Keys
import time
import unittest
import HtmlTestRunner

email = "enter your email here"
email_password = "email password"

# "path where you want to keep generated reports"
report_path = "C:/Users/admin/Desktop/testing/report" 

 # "path where your browser driver is located "
executable_path_1 = "C:/Users/admin/Desktop/testing/driver/chromedriver.exe"

mail_to="mail of recipient"

target_url = "https://express-mailer.netlify.app/"
# target_url = "http://localhost:3000/"

class ExpressMailerTest(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.driver = webdriver.Chrome(executable_path=executable_path_1)
        cls.driver.implicitly_wait(10)
        cls.driver.maximize_window()

    def test_sendmail(self):
        time.sleep(2)
        self.driver.set_page_load_timeout("50")
        self.driver.get(target_url)
        time.sleep(5)
        self.driver.find_element_by_name("btnLogin").click()
        time.sleep(4)
        # Now Send Mail
        self.driver.find_element_by_name("composebtnK").click()
        self.driver.find_element_by_name("to").send_keys(mail_to)
        self.driver.find_element_by_name("subject").send_keys("Cybersecurity Report")
        self.driver.find_element_by_xpath("/html/body/div[1]/div/div[4]/form/div[2]/div[2]/div").send_keys("Dear, bapechatushar04@gmail.com Your Cyber Security Report is ready you can collect it from our office anytime between 7am-6pm. ")
        time.sleep(1)
        self.driver.find_element_by_name("mailClick").click()
        time.sleep(3)
        self.driver.find_element_by_name("avatarMenu").click()
        self.driver.find_element_by_name("logoutBtnK").click()
        

    def test_sendchat(self):
        time.sleep(2)
        self.driver.set_page_load_timeout("50")
        self.driver.get(target_url)
        time.sleep(3)
        self.driver.find_element_by_name("btnLogin").click()
        time.sleep(4)
        # Now Chat
        self.driver.find_element_by_name("addChat").click()
        self.driver.find_element_by_name("mailFieldChat").send_keys(mail_to)
        self.driver.find_element_by_name("startChatBtn").click()
        self.driver.find_element_by_name("chatMsgField").send_keys("Cybersecurity Report")
        time.sleep(2)
        self.driver.find_element_by_name("sendChatBtn").click()
        time.sleep(3)
        self.driver.find_element_by_name("avatarMenu").click()
        self.driver.find_element_by_name("logoutBtnK").click()


    def test_searchmail(self):
        self.driver.set_page_load_timeout("50")
        self.driver.get(target_url)
        window_old = self.driver.window_handles[0]
        self.driver.find_element_by_name("btnLogin").click()
        window_after = self.driver.window_handles[1]
        self.driver.switch_to_window(window_after)
        self.driver.find_element_by_id("identifierId").send_keys(email)
        self.driver.find_element_by_class_name("VfPpkd-RLmnJb").click() 
        time.sleep(3)
        self.driver.find_element_by_name("password").send_keys(email_password)
        self.driver.find_element_by_class_name("VfPpkd-RLmnJb").click() 
        self.driver.switch_to_window(window_old)
        time.sleep(8)
        # Search
        self.driver.find_element_by_name("searchMailInput").send_keys("India")
        time.sleep(2)
        self.driver.find_element_by_xpath("/html/body/div[1]/div/div[2]/div[2]/div[3]/div/div[1]").click()
        time.sleep(3)
        self.driver.find_element_by_name("avatarMenu").click()
        self.driver.find_element_by_name("logoutBtnK").click()

    @classmethod
    def tearDownClass(cls):
        cls.driver.close()
        cls.driver.quit()
        print("Test Completed")

if __name__ == '__main__':
    unittest.main(testRunner=HtmlTestRunner.HTMLTestRunner(output=report_path)) 