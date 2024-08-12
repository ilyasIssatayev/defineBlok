import { defineBlok } from '../src/defineBlok'

const AnyBlok = () => {

    defineBlok({
        name: 'anotherBlok',
        fields: {
            width:{
                type:'number',
                default_value: 48,
            }
        }
    })

    return "some JSX code here"
}

export default AnyBlok;