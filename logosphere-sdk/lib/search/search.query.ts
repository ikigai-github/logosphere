import { SearchFilter } from "./search.filter";

/***
 * Use this as an input parameter to 
 * search the desired records from
 * the database.
 * 
 * @input
 * subject   : Subject from which you want to search the records
 * predicate : topic for which you want to search the record
 * value     : value to search for in the database
 * filter    : any filter to apply as part of the records
 * fuzzy     : boolean value that allows/restricts fuzzy search
 * 
 * @example
 * In order to query for user with username : vulcan
 * the correct usage will be :
 * 
 * {
 *      subject     : user,
 *      predicate   : username,
 *      value       : vulcan
 * }
 * 
 * @example
 * In order to query for user where any prediacte matches the
 * given input : 
 * 
 * {
 *      subject     : user,
 *      value       : vulcan,
 *      fuzzy       : true
 * }
 * 
 * @author : Manik-Jain
 */
export interface SearchQuery {

    subject?        : string;
    predicate?      : string;
    value?          : string;
    fuzzy?          : boolean;
    filters?        : SearchFilter[];
    paginationInfo? : any;
    sortHeuristic?  : string;
    sanitize?       : boolean;
    keyValue?       : any;
    query?          : any;
}