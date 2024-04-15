Feature: 1 User can create a box and run it

Scenario: User can login and create a box
Given user logs in as "olga.bogush87@gmail.com" and "olga_su"
When user creates a new box 
Then user should see created box name
And user should see toggle panel on the box page

Scenario: User can copy invite link
When user clicks button Add participants and copies invite link


Scenario: User "<name>" can create a participant card for the created box
Given user opens invite link and logs in as "<email>" and "<password>"
Then user creates card

Examples:
    |name|email|password|
    |olga1|olga.bogush87+1@gmail.com|olga_su|
    |olga2|olga.bogush87+2@gmail.com|olga_su|
    |olga3|olga.bogush87+3@gmail.com|olga_su|


Scenario: User can draw lots on the created box
Given user logs in as "olga.bogush87@gmail.com" and "olga_su"
When user opens created box
And  user draw lots
Then successful message is displayed




