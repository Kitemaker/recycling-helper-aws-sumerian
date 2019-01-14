
import json
import os
import logging
import boto3
import requests

import sys
import botocore
import re

import urllib.request
from urllib.parse import urlencode
from bs4 import BeautifulSoup
from bs4.element import Tag
import os



launch_reprompt_text = "Sorry I could not find information you are looking for.  You can say \'find recycling center\'"
sorry_text = "Sorry no match found for your input. Please try again"

search_page  = "https://search.earth911.com/?"

######## Convert SSML to Card text ############
from html.parser import HTMLParser
from six import PY2
try:
    from HTMLParser import HTMLParser
except ImportError:
    from html.parser import HTMLParser


class SSMLStripper(HTMLParser):
    def __init__(self):
        self.reset()
        self.full_str_list = []
        if not PY2:
            self.strict = False
            self.convert_charrefs = True

    def handle_data(self, d):
        self.full_str_list.append(d)

    def get_data(self):
        return ''.join(self.full_str_list)


def convert_html_to_text(html_data):
    # convert ssml speech to text, by removing html tags
    s = SSMLStripper()
    s.feed(html_data)
    return s.get_data()


logger = logging.getLogger()
logger.setLevel(logging.ERROR)
output_content = str()

part_detail = ['','','','']
part_detail[0] = "Part 1 is about Preparing Material for Recycling. Information is provided to ensure the proper steps are taken to effectively recycle materials."
part_detail[1] = "Part 2 is an icon which tells about how to recycle the item. Information and locational instructions let you know if an item can be recycled traditionally or by other means."
part_detail[2] = "Part 3 is about Type of Recyclable Material. It provides the lists of what type of material the packaging is made from."
part_detail[3] = "Part 4 can be found at the bottom of the label it tells that which is the Recyclable Parts of Packaging. it gives Information on what parts of the packaging needs to be recycled in this specific way."
                
def elicit_slot(session_attributes, intent_name, slots, slot_to_elicit, message, response_card):
    return {
        'sessionAttributes': session_attributes,
        'dialogAction': {
            'type': 'ElicitSlot',
            'intentName': intent_name,
            'slots': slots,
            'slotToElicit': slot_to_elicit,
            'message': message,
            'responseCard': response_card
        }
    }



def check_valid_key(bucket, key):
    try:
        print('checking validity of image key')
        response = s3.get_object(Bucket=bucket, Key=key)
        return True
    except botocore.exceptions.ClientError as e:
        error_code = e.response['Error']['Code']
        return False
    return True
        

def confirm_intent(session_attributes, intent_name, slots, message, response_card):
    return {
        'sessionAttributes': session_attributes,
        'dialogAction': {
            'type': 'ConfirmIntent',
            'intentName': intent_name,
            'slots': slots,
            'message': message,
            'responseCard': response_card
        }
    }


def close(session_attributes, fulfillment_state, message):
    response = {
        'sessionAttributes': session_attributes,
        'dialogAction': {
            'type': 'Close',
            'fulfillmentState': fulfillment_state,
            'message': message
        }
    }

    return response


def delegate(session_attributes, slots):
    return {
        'sessionAttributes': session_attributes,
        'dialogAction': {
            'type': 'Delegate',
            'slots': slots
        }
    }


def build_response_card(title, subtitle, options):
    """
    Build a responseCard with a title, subtitle, and an optional set of options which should be displayed as buttons.
    """
    buttons = None
    if options is not None:
        buttons = []
        for i in range(min(5, len(options))):
            buttons.append(options[i])

    return {
        'contentType': 'application/vnd.amazonaws.card.generic',
        'version': 1,
        'genericAttachments': [{
            'title': title,
            'subTitle': subtitle,
            'buttons': buttons
        }]
    }

def parse_int(n):
    try:
        return int(n)
    except ValueError:
        return float('nan')


def build_validation_result(is_valid, violated_slot, message_content):
    return {
        'isValid': is_valid,
        'violatedSlot': violated_slot,
        'message': {'contentType': 'PlainText', 'content': message_content}
    }

def build_options(slot):
    """
    Build a list of potential options for a given slot, to be used in responseCard generation.
    """
        
    if slot == 'Out_Language':
        out_card = list()
        for ln in lang_codes.keys():
            out_card.append({'text':ln,'value':ln})
        return out_card
    options = []       

    return options

def get_location(item_data, zip):
    print('entered in the function')
    search_page  = "https://search.earth911.com/?"   
    speech_out = "Sorry there is some problem in finding the location"    
    title, distance, contact, address = str(),str(),str(),str()
    try:
        
        values = {'what' : item_data, 'where' : zip, 'list_filter' : 'all', 'max_distance': '50' } 

        data = urlencode(values)
        req = urllib.request.Request(search_page + data)
        response = urllib.request.urlopen(req, timeout=60)
        page_out = response.read()
        soup = BeautifulSoup(page_out,'html.parser')
        print("Got Response")
        result_details = list()   
        
        for item in  soup.select('.result-list'):
            for result in  item.find_all('li'):
                try:
                    title, distance, contact, phone = "Not Avialble", "Not Avialble", "Not Avialble", "Not Avialble"
                    address, addr1, addr2, addr3 = "","","",""

                    if result.find(attrs={'class':'title'}).get_text() is not None:
                        title = result.find(attrs={'class':'title'}).get_text()

                    if result.find('span', attrs = {'class':'distance'}).get_text() is not None:
                        distance  = result.find('span', attrs = {'class':'distance'}).get_text()

                    if  result.find(attrs={'class':'contact'}) is not None:
                        contact = result.find(attrs={'class':'contact'})

                        if  contact.find( attrs = {'class':'phone'}).get_text() is not None:
                            phone = contact.find( attrs = {'class':'phone'}).get_text()

                        if  contact.find( attrs = {'class':'address1'}).get_text() is not None:
                            addr1 = contact.find( attrs = {'class':'address1'}).get_text()
                        if  contact.find( attrs = {'class':'address2'}).get_text() is not None:
                            addr2 = contact.find( attrs = {'class':'address2'}).get_text()      
                        if  contact.find( attrs = {'class':'address3'}).get_text() is not None:
                            addr3 = contact.find( attrs = {'class':'address3'}).get_text()                   
                    
                    address = addr1 + " " +  addr2 + " " + addr3
                    if address == "":
                        address = "Not Available"

                    loc_data = {'Nearby Center Name':title, 'Distance': distance, 'Phone': phone, 'Address': address.strip() }
                    result_details.append(loc_data)

                except Exception as exc:
                    print("error in finding location details {0}".format(exc))
    except Exception as exc:
            print("Error while getting information from earth911 with following exception : {0}".format(exc))


    print(str.format("Total result found {0}",len(result_details)))
    return result_details


def validate_input(intent_request, item,zip):
    if item is None:
        return build_validation_result(False,'item', "Please tell which item you want to recycle?")
    if zip is None:
        return build_validation_result(False,'zip', "Please tell the zip code near which you want to find recycling center?")
   
            
    return build_validation_result(True, None, None)
    
    
def find_center(intent_request):
    
    if 'item' in intent_request['currentIntent']['slots']:
        item_value = intent_request['currentIntent']['slots']['item']
    else:
        item_value = None
        
    if 'zip' in intent_request['currentIntent']['slots']:
        zip_value = intent_request['currentIntent']['slots']['zip']
    else:
        zip_value = None
        
    
    output_content = ""
    speech = ""
    source = intent_request['invocationSource']
    output_session_attributes = intent_request['sessionAttributes'] if intent_request['sessionAttributes'] is not None else {}
    intent_name = intent_request['currentIntent']['name']

    if source == 'DialogCodeHook':
        # Perform basic validation on the supplied input slots.
        slots = intent_request['currentIntent']['slots']
        validation_result = validate_input(intent_request, item_value, zip_value)
        if not validation_result['isValid']:
            slots[validation_result['violatedSlot']] = None
            return elicit_slot(
                output_session_attributes,
                intent_request['currentIntent']['name'],
                slots,
                validation_result['violatedSlot'],
                validation_result['message'],
                None    
                )
        
        return delegate(output_session_attributes, slots)
        
 
    print(str.format("Getting data with values item ={0} and zip = {1}", item_value, zip_value ))

    result_list = get_location(item_value, zip_value)
    print("Got " + str(len(result_list)) + "results, Preparing results")

    if len(result_list) > 0:
        for k, v in result_list[0].items():
            print(str.format("{0} =>  {1}",k,v))
            speech = speech + str.format(" {0} is  {1}, ",k,v)
        output_content = speech
        try:
            output_session_attributes['Address'] = result_list[0]['Address']
        except:
            output_session_attributes['Address'] = "Seattle, US"
            
    else:
        output_content =  sorry_text
   
    output_content = output_content.replace(u'\ufeff', '')
   
    return close(
        output_session_attributes,
        'Fulfilled',
        {
            'contentType': 'PlainText',
            'content': json.dumps(output_content)
        })
    
def hello_response(intent_request):
    output_session_attributes = intent_request['sessionAttributes'] if intent_request['sessionAttributes'] is not None else {}
    output_content =  'Hello ! I am Turbo Bot, to start a task please enter one of the following options:\n' +\
    'translate,\nfind image,\nrecognise image,\n list face,\n search face,\nsearch user'
                
    return close(
        output_session_attributes,
        'Fulfilled',
        {
            'contentType': 'PlainText',
            'content': output_content
        }
    ) 
    
    
    
def get_recycling_label_info(intent_request):
    output_session_attributes = intent_request['sessionAttributes'] if intent_request['sessionAttributes'] is not None else {}
    output_content =  'How2Recycle label is a voluntary, standardized labeling system that clearly communicates recycling instructions \
           to the public. It involves a coalition of forward thinking brands who want their packaging to be recycled and are empowering \
           consumers through smart packaging labels. A recycling Label has four parts. Part 1 tells How to Prepare Material for Recycling. \
           Part 2 is an icon which tells you whether the item falls into one of four categories - Widely Recycled, Check Locally, Not Yet Recycled and  Store Drop-Off. \
           Part 3 Tells you what type of material the packaging is made of. and Part 4 Tells you the specific packaging component that the label is referring to.'
                
    return close(
        output_session_attributes,
        'Fulfilled',
        {
            'contentType': 'PlainText',
            'content': output_content
        }
    )
    
    
def validate_label_part(intent_request, part_no):
    if part_no is None:
        return build_validation_result(False,'part', "Please tell label part number")
    else:
       if int(part_no) < 1 or int(part_no) > 4:
           return build_validation_result(False,'part', "Label part number is invalid. It should be from 1 to 4. Please tell correct part number")
            
    return build_validation_result(True, None, None)
 
    
def get_label_part_info(intent_request):
    if 'part' in intent_request['currentIntent']['slots']:
        part_value = intent_request['currentIntent']['slots']['part']
    else:
        part_value = None
    
    output_content = ""
    speech = ""
    source = intent_request['invocationSource']
    output_session_attributes = intent_request['sessionAttributes'] if intent_request['sessionAttributes'] is not None else {}
    intent_name = intent_request['currentIntent']['name']

    if source == 'DialogCodeHook':
        # Perform basic validation on the supplied input slots.
        slots = intent_request['currentIntent']['slots']
        validation_result = validate_label_part(intent_request, part_value)
        if not validation_result['isValid']:
            slots[validation_result['violatedSlot']] = None
            return elicit_slot(
                output_session_attributes,
                intent_request['currentIntent']['name'],
                slots,
                validation_result['violatedSlot'],
                validation_result['message'],
                None    
                )
        
        return delegate(output_session_attributes, slots)
        
 
    if int(part_value) in [1, 2, 3, 4]:
       output_content = part_detail[int(part_value) -1]
    else:
        output_content =  "Sorry no details are found for your input. Please try again"
    return close(
        output_session_attributes,
        'Fulfilled',
        {
            'contentType': 'PlainText',
            'content': output_content
        }
    )
    


def validate_howtorecycle_item(intent_request, item_value):
    if item_value is None:
        return build_validation_result(False,'item', "which item you want to recycle?")
    return build_validation_result(True, None, None)
    

def how_to_recycle_info(intent_request):
    if 'item' in intent_request['currentIntent']['slots']:
        item_value = intent_request['currentIntent']['slots']['item']
    else:
        item_value = None
    
    output_content = ""
    speech = ""
    source = intent_request['invocationSource']
    output_session_attributes = intent_request['sessionAttributes'] if intent_request['sessionAttributes'] is not None else {}
    intent_name = intent_request['currentIntent']['name']
    
    if source == 'DialogCodeHook':
        # Perform basic validation on the supplied input slots.
        slots = intent_request['currentIntent']['slots']
        validation_result = validate_howtorecycle_item(intent_request, item_value)
        if not validation_result['isValid']:
            slots[validation_result['violatedSlot']] = None
            return elicit_slot(
                output_session_attributes,
                intent_request['currentIntent']['name'],
                slots,
                validation_result['violatedSlot'],
                validation_result['message'],
                None    
                )
        
        return delegate(output_session_attributes, slots)
        
    print('checking info for {0}'.format(item_value))
    output_session_attributes['link'] = ""
    with open("how_to_recycle_info.json") as f:
        data = json.load(f)['recycle']
        print(data)
   
    for value in data:
        if item_value.lower() in value['item']:
            output_content = ','.join(value['data']['tips'])
            output_session_attributes['link'] = value['data']['link']
            break
        
    if output_content == "":
       output_content  = "Sorry could not find the details for {0}. Please try again or check website how2recycle.info".format(item_value)
   
    return close(
        output_session_attributes,
        'Fulfilled',
        {
            'contentType': 'PlainText',
            'content': output_content
        }
    )
    


def dispatch(intent_request):
    """
    Called when the user specifies an intent for this bot.
    """
    intent_name = intent_request['currentIntent']['name']
    try:
     
        if intent_name == 'FindCenterIntent':
            return find_center(intent_request)
       
        if intent_name == 'HelloIntent':
            return hello_response(intent_request)
            
        if intent_name == 'LabelInfoIntent':
            return get_recycling_label_info(intent_request)
            
            
        if intent_name == 'LabelPartIntent':
            return get_label_part_info(intent_request)
            
        if intent_name == 'HowToRecycleIntent':
            return  how_to_recycle_info(intent_request)
            
    except:
        print(sys.exc_info())
        raise Exception('Error while getting results.')
        
    raise Exception('Intent with name ' + intent_name + ' not supported')


""" --- Main handler --- """

def lambda_handler(event, context):
    """
    Route the incoming request based on intent.
    The JSON body of the request is provided in the event slot.
    """
    return dispatch(event)






