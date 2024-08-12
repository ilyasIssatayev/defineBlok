# DefineBlok

## Project structure

**exampleProject** - folder that imitates directory that holds all the components. Each component can contain 'defineBlok' function to define the schema of the given blok

**src** - folder that contains defineBlok main functionality

 - blokReader - scan the project folder (exampleProject) and calls transformer.ts on each of the file it finds
 - transformer - scan the file and collect data from the defineBlok function
 - API - makes the API call to Storyblok API
 - defineBlok - contains defineBlok function that components can use to define a blok
 - types - hold types
 - experimental - work in progress

## Setup

    1. Copy `.env.example` to `.env` and fill the file
        PROJECT_PATH = root dir of the project 
        SPACE = Storyblok's space id
        STORYBLOK_USER_TOKEN = Storyblok account's access token
    2. `npm install`
    3. `npm run sync`
