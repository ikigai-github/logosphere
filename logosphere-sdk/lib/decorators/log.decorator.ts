/**
 * Decorator to console the invoked functions automatically.
 * 
 * @param logParams : boolean indicating if you want to 
 *                     log the function arguments
 * @param message : any message to console
 * @returns : the result of the invoked function
 * 
 * @author : Manik-Jain
 */
//DO NOT MAKE CHANGES TO THIS FILE UNLESS REALLY REQUIRED
export function Log(logParams : boolean = false, message? : string) {
        
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
      // keep a reference to the original function
      const originalValue = descriptor.value;
      const className = target.constructor ? target.constructor.name : typeof(target)

      descriptor.value = function (...args: any) {

          logParams ? console.log(`[${new Date().toISOString()}] : Invoking ${className}.${propertyKey} with params : `, args) : 
          console.log(`[${new Date().toISOString()}] : Invoking ${className}.${propertyKey}`)

          if(message) {
              console.log(`[${new Date().toISOString()}] : ${message}`)
          }
          // Call the original function
          const result = originalValue.apply(this, args);
          return result;
      }
  };
}