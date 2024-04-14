import * as _ from 'lodash'

export const getObjectWithKey = (obj: {}, fields: string[]) => {
    return _.pick(obj, fields)
} 