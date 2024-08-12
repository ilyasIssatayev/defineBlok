#DefineBlok

##Project structure

**exampleProject** - folder that immitates directory that holds all the comopnents. Each component can contain 'defineBlok' function to define the schema of the given blok

**src** - folder that contains defineBlok main functionality

 - blokReader - scan the project folder (exampleProject) and calls transformer.ts on each of the file it finds
 - transformer - scan the file and collect data from the defineBlok function
 - api - makes the api call to storyblok api
 - defineBlok - contains defineBlok function that components can use to define a blok
 - types - hold types

 - experimental - work in progress

##Setup

    1. Unpack .env.example to .env and fill the file
        PROJECT_PATH = root dir of the project 
        SPACE = storyblok's space id
        STORYBLOK_USER_TOKEN = storyblok account's access token
    2. npm install
    3. npm run sync