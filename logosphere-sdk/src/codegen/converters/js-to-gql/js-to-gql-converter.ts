// import fs from 'fs'
// import { parse, Source } from 'graphql'
// // import {
// //   buildFragmentMasksForDocument,
// //   buildOutputExampleForOperationMask,
// //   buildRequestMaskForDocument,
// //   FragmentMap,
// // } from 'codegenSrc/gql/buildOutputExample'
// import GQLEnumType from './types/gql-enum.type'
// import GQLInOutType from './types/gql-in-out.type'
// import { GQLMutationType } from './types/gql-mutation.type'
// import { GQLQueryType } from './types/gql-query.type'
// // import {
// //   appsyncPath,
// //   codegenPath,
// //   gqlFragmentPath,
// //   gqlMutationsPath,
// //   gqlQueriesPath,
// //   hackoladeModelPath,
// //   hackoladeMutationsPath,
// //   hackoladeQueriesPath,
// //   responseExamplesPath,
// //   s3MockBucket,
// // } from 'codegenSrc/paths'
// import {
//   buildGQLInOutType,
//   buildGQLMutationType,
//   buildGQLQueryType,
//   getExamples,
// } from 'codegenSrc/gql/jsonToGQLTypes'
// import {
//   has_$ref,
//   has_enum,
//   has_properties,
//   has_required,
// } from 'codegenSrc/gql/jsonTypeCheck'
// import { pascalCase } from 'pascal-case'

// import {
//   S3Client,
//   PutObjectCommand,
//   PutObjectCommandOutput,
// } from '@aws-sdk/client-s3'

// import path from 'path'
// import { schemaSource, apiTarget, appSyncTarget } from '../paths'
// import { mergeDeep } from 'codegenSrc/gql/mergeUtils'

// /**
//  * READ ME!!!
//  *
//  * This is a parser designed to take the Hackolade JSON Schema output and turn it into
//  * a GraphQL schema. It requires:
//  *   - referenced definitions
//  *   - standard JSON schema
//  *   - 2019-09 draft JSON spec
//  *
//  * CAVEATS:
//  * - input and output types can NOT be shared (this is a GQL limitation, not the JSON schema)
//  * - base types MUST be OBJECTS
//  *   - NO scalar base types
//  *   - NO array base types
//  * - objects can NOT have function fields
//  * - Array type support is limited, Hackolade can only represent Type! or [Type]!
//  *   - [Type!] and [Type!]! can NOT be represented
//  */

// // build GQL enum/IO types

// export interface GQLTypes {
//   gqlEnumTypes: GQLEnumType[]
//   gqlInOutTypes: GQLInOutType[]
//   gqlQueryTypes: GQLQueryType[]
//   gqlMutationTypes: GQLMutationType[]
// }

// export const parseHackoladeJSON = (): GQLTypes => {
//   const modelFile = fs.readFileSync(hackoladeModelPath)
//   const model = JSON.parse(modelFile.toString())

//   const gqlEnumTypes: GQLEnumType[] = []
//   const gqlInOutTypes: GQLInOutType[] = []
//   const parseModelDefinitions = (definitions: unknown) => {
//     if (!definitions || typeof definitions !== 'object') {
//       return
//     }

//     for (const key in definitions) {
//       const def = definitions[key]

//       if (has_enum(def)) {
//         // handling enum type definition
//         const examples: (string | number)[] | undefined = getExamples(def)
//         const gqlEnumType = new GQLEnumType(pascalCase(key), def.enum, examples)
//         gqlEnumTypes.push(gqlEnumType)
//       } else if (!has_$ref(def) && has_properties(def)) {
//         let requiredFields: string[] = []
//         if (has_required(def)) {
//           requiredFields = def.required
//         }
//         // handling in/out type definition
//         const gqlInOutType = buildGQLInOutType(
//           pascalCase(key),
//           def.properties,
//           requiredFields
//         )

//         if (gqlInOutType) {
//           gqlInOutTypes.push(gqlInOutType)
//         }
//       }
//     }
//   }

//   parseModelDefinitions(model.$defs)
//   parseModelDefinitions(model.properties)

//   // build GQL request types

//   const parseModelFile = (filepath: string) => {
//     const queryModelFile = fs.readFileSync(filepath)
//     const queryModel = JSON.parse(queryModelFile.toString())

//     return queryModel
//   }

//   // GQL queries
//   const queryFiles = fs.readdirSync(hackoladeQueriesPath)
//   const gqlQueryTypes: GQLQueryType[] = []

//   queryFiles.forEach((filename) => {
//     // only look at json schema files
//     if (!filename.endsWith('json')) {
//       return
//     }

//     const queryModel = parseModelFile(`${hackoladeQueriesPath}/${filename}`)

//     const gqlQueryType = buildGQLQueryType(
//       queryModel.title,
//       queryModel.properties.input,
//       queryModel.properties.output
//     )
//     gqlQueryTypes.push(gqlQueryType)
//   })

//   // GQL mutations
//   const mutationFiles = fs.readdirSync(hackoladeMutationsPath)

//   const gqlMutationTypes: GQLMutationType[] = []
//   mutationFiles.forEach((filename) => {
//     const mutationModel = parseModelFile(
//       `${hackoladeMutationsPath}/${filename}`
//     )

//     const gqlMutationType = buildGQLMutationType(
//       mutationModel.title,
//       mutationModel.properties.input,
//       mutationModel.properties.output
//     )
//     gqlMutationTypes.push(gqlMutationType)
//   })

//   return {
//     gqlEnumTypes,
//     gqlInOutTypes,
//     gqlQueryTypes,
//     gqlMutationTypes,
//   }
// }

// export const printSchemasToFile = (gqlTypes: GQLTypes): void => {
//   printSchemaToFile(`${codegenPath}/schema.gql`, false, gqlTypes)
//   printSchemaToFile(`${appsyncPath}/schema-dev.gql`, false, gqlTypes)
//   printGqlTypesJson(`${appsyncPath}/gql-types.json`, gqlTypes)
// }

// const printGqlTypesJson = (filepath: string, gqlTypes: GQLTypes): void => {
//   const output = {
//     query: gqlTypes.gqlQueryTypes.map((type) => type.getName()),
//     mutation: gqlTypes.gqlMutationTypes.map((type) => type.getName()),
//   }
//   fs.writeFileSync(filepath, JSON.stringify(output, null, '\t'))
//   console.log(`exporting GQL types to ${filepath}`)
// }

// // print schema file
// const printSchemaToFile = (
//   filepath: string,
//   isTypenameAllowed: boolean,
//   gqlTypes: GQLTypes
// ) => {
//   const { gqlEnumTypes, gqlInOutTypes, gqlQueryTypes, gqlMutationTypes } =
//     gqlTypes

//   const inputTypeNames = new Set<string>()

//   // add all the request input types to the set
//   gqlQueryTypes.forEach((gqlQueryType) => {
//     gqlQueryType.getBareInputTypes(gqlInOutTypes).forEach((inputTypeString) => {
//       inputTypeNames.add(inputTypeString)
//     })
//   })

//   gqlMutationTypes.forEach((gqlMutationType) => {
//     gqlMutationType
//       .getBareInputTypes(gqlInOutTypes)
//       .forEach((inputTypeString) => {
//         inputTypeNames.add(inputTypeString)
//       })
//   })

//   // start building the GQL schema string
//   let gqlSchema = ''
//   gqlEnumTypes.forEach((tt) => {
//     const schemaString = tt.toSchema() + '\n\n'
//     gqlSchema += schemaString
//   })

//   gqlInOutTypes.forEach((tt) => {
//     const isInputType = inputTypeNames.has(tt.getName())
//     gqlSchema +=
//       tt.toSchema({
//         isInputType: isInputType,
//         allowTypename: isTypenameAllowed,
//       }) + '\n\n'
//   })

//   gqlSchema += 'type Query {\n'
//   gqlQueryTypes.forEach((tt) => {
//     const schemaString = `  ${tt.toSchema()}\n`
//     gqlSchema += schemaString
//   })
//   gqlSchema += '}\n\n'

//   gqlSchema += 'type Mutation {\n'
//   gqlMutationTypes.forEach((tt) => {
//     const schemaString = `  ${tt.toSchema()}\n`
//     gqlSchema += schemaString
//   })
//   gqlSchema += '}\n\n'

//   console.log(`exporting schema to: ${filepath}`)
//   fs.mkdirSync(codegenPath, { recursive: true })
//   fs.writeFileSync(filepath, gqlSchema)
// }

// export const buildMergedOperationMasks = (): unknown[] => {
//   // generate GQL fragment definitions ahead of time
//   const fragmentMap = buildFragmentMap()

//   // map of operation name -> operation mask array
//   const operationMaskMap = buildOperationMap(fragmentMap)

//   // for every operation in the map, build a super set
//   const mergedOperationMasks: unknown[] = []
//   operationMaskMap.forEach((value) => {
//     const operations = value

//     let mergedOperationMask = operations.pop()
//     operations.forEach((operationMask) => {
//       mergedOperationMask = mergeDeep(mergedOperationMask, operationMask)
//     })

//     mergedOperationMasks.push(mergedOperationMask)
//   })

//   return mergedOperationMasks
// }

// const buildFragmentMap = () => {
//   try {
//     const fragmentFile = fs.readFileSync(gqlFragmentPath, { encoding: 'utf8' })
//     const parsedDocument = parse(new Source(fragmentFile))
//     return buildFragmentMasksForDocument(parsedDocument)
//   } catch (error) {
//     console.log(`error while loading fragment map: `)
//     console.error(error)
//     console.log('exporting requests without any fragment definitions...')
//   }

//   return undefined
// }

// const buildOperationMap = (fragmentMap?: FragmentMap) => {
//   const operationMaskMap: Map<string, unknown[]> = new Map()

//   addDocumentMasks(gqlQueriesPath, fragmentMap, operationMaskMap)
//   addDocumentMasks(gqlMutationsPath, fragmentMap, operationMaskMap)

//   return operationMaskMap
// }

// const addDocumentMasks = (
//   documentDirPath: string,
//   fragmentMap: FragmentMap | undefined,
//   outputMask: Map<string, unknown[]>
// ) => {
//   const documentFiles = fs.readdirSync(documentDirPath)
//   documentFiles.forEach((filename) => {
//     // only look at gql files
//     if (!filename.endsWith('gql')) {
//       return
//     }

//     const documentPath = `${documentDirPath}/${filename}`
//     let parsedDocument
//     try {
//       const documentFile = fs.readFileSync(documentPath, { encoding: 'utf8' })
//       const documentSource = new Source(documentFile)
//       parsedDocument = parse(documentSource)
//     } catch (e) {
//       console.log(
//         `failed to parse document file (${documentPath}), skipping...`
//       )
//       return
//     }

//     const documentMask = buildRequestMaskForDocument(
//       parsedDocument,
//       fragmentMap
//     )

//     // everything at the first level is going to be operation definitions
//     if (documentMask) {
//       const operationKeys = Object.keys(documentMask)
//       operationKeys.forEach((operationKey) => {
//         // we need to include the operation name in the mask!
//         const operationMask = {}
//         operationMask[operationKey] = documentMask[operationKey]

//         if (outputMask.has(operationKey)) {
//           outputMask.get(operationKey)?.push(operationMask)
//         } else {
//           outputMask.set(operationKey, [operationMask])
//         }
//       })
//     }
//   })
// }

// export const exportOperationExamples = (
//   operationMasks: Record<string, unknown>[],
//   gqlTypes: GQLTypes
// ): void => {
//   // make sure the output dir is created
//   fs.mkdirSync(responseExamplesPath, { recursive: true })

//   // TODO: delete files that aren't part of the operation set
//   operationMasks.forEach((operationMask) => {
//     if (operationMask) {
//       const outputExample = buildOutputExampleForOperationMask(
//         operationMask as Record<string, unknown>,
//         gqlTypes
//       )

//       // filename is the first key of the operation mask
//       const operationName = Object.keys(operationMask)[0]

//       // generate document output examples next to their document
//       const filepath = `${responseExamplesPath}/${operationName}.response.json`
//       const exampleJSON = JSON.stringify(outputExample, null, 2)
//       console.log(`exporting example for ${operationName} to: ${filepath}`)
//       fs.writeFileSync(filepath, exampleJSON)

//       uploadExampleToS3(operationName, exampleJSON)
//     }
//   })
// }

// const uploadExampleToS3 = (operationName: string, exampleJSON: string) => {
//   //export to S3 bucket
//   const s3 = new S3Client({
//     region: process.env.AWS_REGION || 'us-east-1',
//   })

//   const uploadParams = {
//     Bucket: s3MockBucket,
//     Key: `${operationName}.json`,
//     Body: exampleJSON,
//   }

//   try {
//     s3.send(new PutObjectCommand(uploadParams)).then(
//       (output: PutObjectCommandOutput) => {
//         if (output.$metadata.httpStatusCode === 200) {
//           console.log(
//             `uploaded example for ${operationName} to s3://${uploadParams.Bucket}/${uploadParams.Key}`
//           )
//         }
//       }
//     )
//   } catch (err) {
//     console.log(`Error occured while uploading example documents to S3: ${err}`)
//   }
// }

// export const copySchemaToApi = (gqlTypes: GQLTypes): void => {
//   console.log(`copying schema definition to '${apiTarget}'`)
//   fs.writeFileSync(apiTarget, fs.readFileSync(schemaSource, 'utf8'))
//   console.log(`copied schema definition to '${apiTarget}'`)

//   console.log(`Copying GQL schema for AppSync to ${appSyncTarget}/schema.graphql`)
//   printSchemaToFile(`${appSyncTarget}/schema.graphql`, false, gqlTypes)
//   console.log(`Copied GQL schema for AppSync to ${appSyncTarget}/schema.graphql`)
// }
