const api = require("./api")

//Scans block library and identifies if some are unused
const scanBlocks = async () => {
    const blocks = await api.pullBlock('');

    let blockNames = []
    let usedBlockNames = []
    let storyIds = []
    blocks.components.forEach(element => {
        blockNames.push(element.name)
    });
    console.log('Scanning...')
    const stories = await api.pullStory('');
    stories.stories.forEach(element => {
        storyIds.push(element.id)
    });

    for (let i = 0; i < storyIds.length; i++) {
        const id = storyIds[i];
        let success = false;
        let story;
        while(!success){
            story = await api.pullStory('' + id);
            if(story.story !=undefined) success = true;
        
        }
        
        
        story.story.content?.body?.forEach(block => {

            if (!usedBlockNames.includes(block.component)) {
                usedBlockNames.push(block.component)
                //if(block.component == "assetList") console.log("assetList is in the story: ",story)
    
                blockNames = blockNames.filter(element => element != block.component)
            }

            if (block.component == "container") {
                for (let j = 0; j < block.items.length; j++) {
                    const name = block.items[j].component;
                    if (!usedBlockNames.includes(block.component)) {
                        usedBlockNames.push(block.component)
                        blockNames = blockNames.filter(element => element != block.component)
                    }
                }
            }
        })
    }
    console.log("Used blocks: ")
    console.log(usedBlockNames)
    console.log("Unused block: ")
    console.log(blockNames)
}

const main = async () => {

    scanBlocks();

    // const response = await api.updateBlock('TestSubject', {
    //     title2: { type: 'text', default_value: 'main title placeholder' },
    //     isBoolean2: { type: 'boolean', default_value: true },
    //     asset2: { type: 'asset' }
    // }, { override: true, forceSpawn: true })
}

main();