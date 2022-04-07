import _ from 'lodash'
import { sha3_256 } from 'js-sha3';
import * as c from './const'
import { IDENTIFIER, OBJECT, CREATED_AT, CONVERTOR, TIME_CONVERTOR, ONE_THOUSAND } from './const';

/**
 * Creates a dashed prefix, if prefix is not empty, or empty string otherwise
 * @param prefix : prefix
 * @returns : dashed prefix or empty string
 */
export function dashedPrefix(prefix: string): string {
    return prefix.trim().length > 0 ? prefix.toLowerCase() + '-' : ''
}

/**
 * Splits S3 url into bucket, key tuple
 * @param url 
 * @returns 
 */
export function splitS3Url(url: string): { bucket: string; key: string } {
    const regexp = new RegExp(c.S3_URL_REGEX)
    const parts = url.split('/')
    return {bucket: parts[2], key: parts.slice(3).join('/')}
}

/**
 * Converts string in camel case to kebab case
 * @param str : string in camel case
 * @returns string in kebab case
 */
 export function camelToKebab(str: string): string {
    return  str.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)
}

/**
 * Converts string in camel case to pascal case
 * @param str : string in camel case
 * @returns string in pascal case
 */
export function camelToPascal(str: string): string {
    return str[0].toUpperCase() + str.substring(1)
}

/**
 * Deep diff between two object, using lodash
 * @param object: Object compared
 * @param base:   Object to compare with
 * @return Return a new object who represent the diff
 * 
 * Credit: https://gist.github.com/Yimiprod/7ee176597fef230d1451
 */
 export function difference(object: any, base: any) {
	function changes(object: any, base: any) {
		return _.transform(object, (result: any, value: any, key: string) => {

			if (!_.isEqual(value, base[key])) {
				result[key] = (_.isObject(value) && _.isObject(base[key])) ? changes(value, base[key]) : value;
			}
		});
	}
	return changes(object, base)
}

/**
 * Maps JSON schema types to TypeScript interface types
 * @param jsonType: JSON schema type 
 * @returns TypeScript interface type
 */
export function jsonToInterfaceTypeMap(jsonType: string): string {
    switch (jsonType) {
        case c.INTEGER: 
            return c.NUMBER 
        case c.OBJECT:
            return c.ANY
        default:
            return jsonType
    }
}

/**
 * Prints debug statement to the console
 */
export function debug(message: string, object: any): void {
    if (c.DEBUG) {
        console.log('-'.repeat(10))
        console.log(`DEBUG: ${message}`)
        console.log(JSON.stringify(object))
        console.log('-'.repeat(10))
    }
}

export function createIdentifier(data: any): string {
    return sha3_256(JSON.stringify(data).concat(Date.now().toString()));
}

export const sanitize = (data : any[]) => {
    data.forEach(entry => {
        delete entry._id
        Object.keys(entry).forEach(key => {
            if(Array.isArray(entry[key])) {
                sanitize(entry[key])
            } else if(typeof entry[key] === 'object') {
                delete entry[key]._id
            }
        })
    })
    return data
}

/**
 * common function that converts prices from 
 * 
 * 1. original value to scaled value i.e, (value * SCALING_VALUE)
 * 2. scaled value to original value i.e, (value / SCALING_VALUE)
 * 
 * Internally we consider a scaling factor of 10^^12 
 * The SCALING_VALUE used has been defined in the function
 * to avoid any un-intentional modifications
 * 
 * @param data array or an object 
 * @param format specifies which format to convert
 * @returns converted price values
 */
export const convertPrice = (format: CONVERTOR, data: any) => {
    const SCALING_VALUE = 10 ** 6;
    if(Array.isArray(data)) {
        return format === CONVERTOR.TO_SCALED_INTEGER_PRECISION_VALUE ? 
            data.map(entry => entry * SCALING_VALUE) : 
            data.map(entry => entry / SCALING_VALUE)
    } else if(typeof data === OBJECT) {
        Object.keys(data).forEach(key => {
            if(key !== IDENTIFIER && key !== CREATED_AT) {
                format === CONVERTOR.TO_SCALED_INTEGER_PRECISION_VALUE ? 
                    data[key] = data[key] * SCALING_VALUE : 
                    data[key] = data[key] / SCALING_VALUE
            }
        })
        return data;
    }
}

export const convertTimeValue = (format: TIME_CONVERTOR, data: [number]) => {
    const SCALING_VALUE = ONE_THOUSAND;
    if(Array.isArray(data)) {
        return format === TIME_CONVERTOR.TO_MILLI_SECONDS ? 
            data.map(entry => entry * SCALING_VALUE) : 
            data.map(entry => entry / SCALING_VALUE)
    } else {
        return data;
    }
}

export const isArray = (input : any[]) => {
    return Array.isArray(input) && input.length > 0
}

export const diff = (array1 : any[], array2 : any[]) => {
    array1.filter(x => !array2.includes(x))
}

export const combinedDiff = (array1 : any[], array2 : any[]) => {
    array1.filter(x => !array2.includes(x)).concat(array2.filter(x => !array1.includes(x)));
}

export function createSingleton<T>(name: string, create: () => T): T {
    const s = Symbol.for(name);
    let scope = (global as any)[s];
    if (!scope) {
        scope = {...create()};
        (global as any)[s] = scope;
    }
    return scope;
}
