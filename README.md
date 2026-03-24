 ## npm create vite@latest devtinder --template react

 ## removed unnecessary code
color -theme -#ffcc63 #faa307
-tailwind css
npm install -D tailwindcss@3                                  
npx tailwindcss init

tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

dont use this input.css instead add the chenages in index.css

@tailwind base;
@tailwind components;
@tailwind utilities;

post css config .js
export default {
    plugins: {
        tailwindcss: {},
        autoprefixer: {},
    },
}

##component library 
daisy UI ->compatible with tailwind css



4 th vedio
see all connection -> 


Web socket -> 
chat showuld scoll when chat msg send to bottom always

auth in web socket bug
chek if userand target user id are frinds are not check
last seen feature green dot 
limit msg on api call the chatting
chess game design


new requiremnt 
1)mutual connection 
2)on connection page chat section show
3)new chat section add 
4)show the typing like a snapchat way




