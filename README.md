# apac-mailer

## Thanks to magic, now the executable works!

Please come to this [link](https://github.com/APACAPU/apac-mailer/blob/master/win-unpacked.zip) to download the zip files and run the apac-mailer.exe
(no virus, I promise)

## App features & Guides

![image](https://user-images.githubusercontent.com/55322546/136894878-2e9c532e-1520-4c65-8f30-b2de0c164682.png)

### 1. Email
  - Enter your email and password here, for password, please head to your gmail account and set up an app password ([Guide here](https://devanswers.co/create-application-specific-password-gmail/))
  
  ![image](https://user-images.githubusercontent.com/55322546/136894958-1703f309-d9d6-47df-8878-c89e8651c637.png)
  
  - Select a csv file, if you wish to, ~~you can change the separator~~
  - Select the people whom you wish to email to
  - Remember not to select any empty rows at the end if there are any
  
  ![image](https://user-images.githubusercontent.com/55322546/136895028-20437009-aba3-4abd-a836-4647eea96497.png)

  - Enter the email columns & name column (if you decide to insert a cert, this column will be used)
  
  ![image](https://user-images.githubusercontent.com/55322546/136895105-c86abebe-3ba7-4096-a789-6c9883b3cd29.png)

  - All attachments will be taking the same name as the files in your folder
  - Click SEND when you're ready to send the email

### 2. Email Design
  - Set your design here
  
  ![image](https://user-images.githubusercontent.com/55322546/136895179-2f2bab85-f870-4aef-a8ad-056788d5f50a.png)

  - Mainly drag & drop, you can export your design and it'll be exported as design.json in your folder.
  - After exporting, you can import the same design back.
  - Make sure you click **SAVE DESIGN** after done with your design (even if you're importing)
  - If you want to use variables, (like name from csv file in step 1) just wrap them in ^\*....\*^ in anywhere in your email design
  
  ![image](https://user-images.githubusercontent.com/55322546/136895349-baa65d2d-c709-4246-89e3-f5bcec7c07f1.png)

### 3. Cert Design
  - **Must use JPG format**, PNG format is too big, which causes the app to crash when trying to create Blob URL for email sending
  - Will only be used if you checked 'use cert' in email settings
  
  ![image](https://user-images.githubusercontent.com/55322546/136895503-0cf74679-6d8c-441a-a3a0-ad008a46717d.png)

  - Filename default is attachment if no name is specified.
  - Sometimes if the pdf is not updating, click any of the slider.
  - Due to unknown issue, the fonts are kinda above 0, so you must set Y to bigger than 0 to start seeing the words
  - The words in the file will be replaced with name column as specified in email setting
  - You can set align center to true, then the X position will be used as the center of the texts. 
  - For centering, you can use the align center and x distance of 105 or 149 for portrait and landscape respectively.
  - Note: Sometimes the cert will be unresponsive, then you need to drag the X & Y slider and you'll see
the preview being updated.

<hr>

## Project setup

1. Install npm (My npm version is 6.14.15)
  Please refer to this [guide](https://phoenixnap.com/kb/install-node-js-npm-on-windows).

2. Download this repository / folder
  - Click Code
  - Download as zip
  - Unzip the folder  
  ![image](https://user-images.githubusercontent.com/55322546/136896008-c98e92a1-6059-4bb8-b074-e6c20d4c991c.png)

  
3. Open your cmd and go to the folder containing the apac-mailer
  - Open cmd by Windows + r, cmd enter or just search command prompt
 
![image](https://user-images.githubusercontent.com/55322546/136893464-90af59cf-2529-4a7b-8cd4-081256be431c.png)

![image](https://user-images.githubusercontent.com/55322546/136893615-93b37fb3-2065-41ce-bce8-2d9a1d4df18f.png)


 - Copy the path of the folder 

![image](https://user-images.githubusercontent.com/55322546/136893564-511ee8b4-ace4-4d6f-aba3-777d7d827fc4.png)

 - Go to the folder 
```
cd <the path you copied>
```
  Ex:
```
cd C:\Users\ACER\sy\Code\apac-mailer
```

4. Run the following codes to install the libraries needed
```
npm install
```

## Open the app

- Run the following line in cmd after npm install (Make sure your cmd is still in the apac-mailer folder)

```
npm run electron:serve
```

**Note: sometimes all inputs are unresponsive, then you need to click select file from email tab and click cancel.**

![image](https://user-images.githubusercontent.com/55322546/136893827-ccb22f22-6d89-41fd-b259-80f57e80683c.png)

Known issue: Net::error from reading email editor,

Solution: Add https: in front of line 2834, or the variable scriptUrl in vue-email-editor.common.js from Vue Email Editor.

* This app is made for APAC, but is free to be used & adapted by others.
