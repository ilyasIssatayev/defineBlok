import * as dotenv from 'dotenv';
dotenv.config();

import { getAllBlokConfigs } from './blokReader';
import { updateBlock } from './api'

console.log('defineBlok GO!')

const blokConfigs = getAllBlokConfigs();

console.log('syncing bloks:')
blokConfigs?.forEach(({ definition }) =>
    updateBlock(
        definition.name,
        definition.fields,
        { forceSpawn: true }
    )
)
