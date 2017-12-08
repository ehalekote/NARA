import os
from selenium import webdriver
from requests import get
import time
import mysql.connector
import geocoder

print('******************************************************************************************************************************************')

####################################################SETUP####################################################
os.makedirs('locations', exist_ok=True)
#browser = webdriver.Firefox()
browser = webdriver.PhantomJS(executable_path='/usr/local/lib/node_modules/phantomjs-prebuilt/lib/phantom/bin/phantomjs')
#browser = webdriver.Chrome("/Users/ehalekote/Downloads/chromedriver")
#browser = webdriver.Safari()
browser.implicitly_wait(10)
browser.get('http://maps.redcross.org/website/maps/ARC_Shelters.html')

####################################################FIND DATA divs####################################################
div = browser.find_element_by_class_name('dojoxGridMasterView')
div1 = div.find_element_by_id('dojox_grid__View_0')
div2 = div1.find_element_by_tag_name('div') # div = dojoxGridScrollbox
div3 = div2.find_element_by_tag_name('div')
div4 = div3.find_elements_by_class_name('dojoxGridRow')

#####################################################SCROLL####################################################

js_func ='''

    var objDiv = document.getElementById('dojox_grid__View_0').getElementsByClassName('dojoxGridScrollbox')[0];
    objDiv.scrollTop = objDiv.scrollHeight;

    '''

browser.execute_script(js_func)
time.sleep(2)

####################################################REFIND DIVS####################################################
div = browser.find_element_by_class_name('dojoxGridMasterView')
div1 = div.find_element_by_id('dojox_grid__View_0')
div2 = div1.find_element_by_tag_name('div') # div = dojoxGridScrollbox
div3 = div2.find_element_by_tag_name('div') #div = dojoxGridContent
div4 = div3.find_elements_by_tag_name('div')
#print("DEBUG4")

####################################################OPEN CONNECTION####################################################
conn = mysql.connector.connect(
                               user='Alex',
                               password='artificialnishanthintelligence',
                               port='3306',
                               host='138.197.192.173',
                               database='nara')
cur = conn.cursor(buffered=True)

tempShelter = []

cur.execute("TRUNCATE shelter")

for item in div4:
    if(('dojoxGridRow' in item.get_attribute('class')) or ('dojoxGridRow dojoxGridRowOdd' in item.get_attribute('class'))):
        RowElement = item.find_elements_by_tag_name('td')
        for individualRowElement in RowElement:
            tempShelter.append(individualRowElement.text)
            print(individualRowElement.text)
        adr = tempShelter[2]+' '+tempShelter[3]+' '+tempShelter[4]+' '+tempShelter[5]
        latlong = (geocoder.google(adr)).latlng; lat = latlong[0]; longi = latlong[1]
        cur.execute("INSERT INTO shelter (name,address,latitude,longitude) VALUES (%s,%s,%s,%s)", (tempShelter[0],adr,lat,longi))
        print('*******************************************************')
        tempShelter = []
conn.commit()
cur.close()
conn.close()
