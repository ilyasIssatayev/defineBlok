import fetch from 'node-fetch';
import { BlokFields } from 'types';

const TOKEN = process.env.STORYBLOK_USER_TOKEN;
const SPACE = process.env.SPACE;
const HEADERS: Record<string, string> = { 'Content-Type': 'application/json', ...(TOKEN && { Authorization: TOKEN }) }

// Pulls the story from the story list
const pullStory = async (storyName = '') => {
    const response = await fetch("https://mapi.storyblok.com/v1/spaces/" + SPACE + "/stories/" + storyName, {
        headers: HEADERS

    });
    const story = await response.text();
    if (response.status != 200) return {
        error: true,
        response: response
    }
    return JSON.parse(story);
}

// Pulls the block from the block library
const pullBlock = async (blockName = '') => {
    const response = await fetch("https://mapi.storyblok.com/v1/spaces/" + SPACE + "/components/" + blockName, {
        headers: HEADERS
    });
    const block = await response.text();
    if (response.status != 200) return {
        error: true,
        response: response
    }
    return JSON.parse(block);
}

//Puts the block to the block library, under the hood it overrides the existing block with the new one
const putBlock = async (block: any) => {
    block.update_content = true;
    const response = await fetch("https://mapi.storyblok.com/v1/spaces/" + SPACE + "/components/" + block.component.id, {
        method: 'PUT',
        headers: HEADERS,
        body: JSON.stringify(block)
    });
    return response;
}

//Posts the block to the block library, under the hood it creates a new block in the block library
const postBlock = async (name: string, group_uuid: unknown = null) => {
    const response = await fetch("https://mapi.storyblok.com/v1/spaces/" + SPACE + "/components/", {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify({
            component_group_uuid: group_uuid,
            is_nestable: true,
            is_root: false,
            name
        })
    });
    return response;
}

//Update the existing block with given schema
//args:
//  override - set true if you want to override the existing schema and not add on top of the old values
//  forceSpawn - set true if you want to create a new block if the block with given name doesnt exist in the block library


/**
 * Update the existing block with given schema
 * @param {string} name - blok name
 * @param {BlokFields} blokFields - Fields of the blok.
 * @param {{ override?: boolean, forceSpawn?: boolean }} args -args:
 * 
 * override - set true if you want to override the existing schema, otherwise it will keep mix new values with exsiting ones
 * 
 * forceSpawn - set true if you want to create a new block if the block with given name doesnt exist in the block library
 * 
 * @returns {fetch.Response} API call response
 */
const updateBlock = async (name: string, blokFields: BlokFields, args: { override?: boolean, forceSpawn?: boolean }) => {

    let block = await pullBlock(name);
    console.log('   > blok name: ', name)
    console.log('   > schema: ', blokFields);
    if (block.error) {
        if (block.response.status == 404 && args.forceSpawn) {
            console.log('   > update block ' + name + ': failed to pull, creating a new block ' + name);
            const postResponse = await postBlock(name);
            console.log('   > update block ' + name + ': ' + postResponse.status, postResponse.statusText)
            const createdBlok = await postResponse.text();
            block = JSON.parse(createdBlok);
        }
        else {
            console.log('   > update block ' + name + ': failed to pull, error > ' + block.response.status, block.response.statusText)
            return block.response;
        }
    }
    block.component.schema = args.override ? blokFields : { ...block.component.schema, ...blokFields };
    const response = await putBlock(block);
    console.log('   > update block ' + block.component.id + ': ', response.status);
    return response;
}

export { pullBlock, putBlock, postBlock, updateBlock, pullStory }