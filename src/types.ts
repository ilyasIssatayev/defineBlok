type BlokDefinition = {
    name: string;
    fields: BlokFields;
};

type BlokFields = {
    [key: string]: {
        [prop: string]: unknown;
        type: string;
    };
}

type BlokBundle = {
    file: {
        path: string,
        name: string
    },
    definition: BlokDefinition
}

type Callback = (blok: BlokDefinition) => void;

export type { BlokDefinition, Callback, BlokFields,BlokBundle };