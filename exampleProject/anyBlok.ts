import { defineBlok } from '../src/defineBlok'

const AnyBlok = () => {

    defineBlok({
        name: 'anyBlok',
        fields: {
            title:{
                type:'text',
                default_value: 'default title here'
            }
        }
    })

    return "some JSX code here"
}

export default AnyBlok;