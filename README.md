# recycling-helper-aws-sumerian
AWS Sumerian based AR application to get info for Recycling Labels and Nearby Recycling center with the help Sumerian Host
## Inspiration
How2Recycle is a standardized labeling system that clearly communicates recycling instructions to the public. It involves a coalition of forward thinking brands who want their packaging to be recycled and are empowering consumers through smart packaging labels. 
Recycling labels placed on various consumer products are displayed with icons and limited texts. We need a resource which can provide quick information about the labels to the person who wants to recycle the item after consumption. What better than an AR mobile app, which is easy and handy to access for this task. By using Sumerian and Android ARCore based mobile APP, user can scan the recycling label to get the information about the various parts o the label. 
Also once we have information about the recycling label, we can find nearby recycling center by providing item ( CFL, Laptop , glass) and Zip Code  to our recycling helper  ( Sumerian Host ) this helper shall provide information and also will tell how to prepare the item for recycling . 
It is a complete solution to help people getting information about the recycling process. 

## What it does
### Provide information about recycling labels by scanning the label using the mobile camera
### User can launch  Recycling Helper (Sumerian Host) in AR environment to get  detailed information about the recycling labels and its various parts. 
### Recycling Helper can provide information about the nearby recycling center by using web site of earth911.com.
### Provide the steps how to prepare an item to recycle

## How I built it
This application has two parts 
(i) Getting information about the recycling label using Image Recognition by ARCore in android App. At present it can recognize 20 different recycling labels. 
(ii) Recycling Helper based on Sumerian Host Luke. This host can be launched in the real environment using ARCore and this host shall provide information about:
(a) Nearby recycling center by using web scraping of earth911.com. As the address is identified by AWS Lambda , the information is passed by Lex to Sumerian Host. This message is processed using google Map API and nearby recycling center is also indicated on the Map provided in the Screen inside the scene
(b) Information about the structure and parts of the recycling label for this data is collected form website "how2recycle.info" and matching images are fetched from "AWS S3" whenever Lex response is received.
(c) Stpes to   prepare item for recycling for example Glass, Metal, Paper, Mobile etc.  Related Web Page from earth911.com is also displayed iinside the scene. 


## Challenges I ran into
I prepared 2500 images of various recycling labels but ARCore has limitation of scanning 20 images , so At present I have restricted app for 20 images. Finding correct size of Map Screen and Host  took the time and also synchronization between Lex Response and display of Map and Various images was interesting points

## Accomplishments that I'm proud of
This is my first AR application I am quite happy to develop the application for a social cause. Providing information by scanning label will definetely help people understanding about recycling labels. also we can quickly find nearby recycling center

## What I learned
I have learned Sumerian and ARCore for this application

## What's next for Recycling Helper
