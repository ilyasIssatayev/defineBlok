import * as ts from 'typescript';
import type { BlokDefinition, Callback } from './types';

//Hardcoded for now, should we allow users to define it (would be cool)???
const TARGET_FUNCTION = 'defineBlok';

///Parse the nested objects or simple fields and checks all the children with any depth
const ParseExpression = (expression: ts.Expression) => {
    //simple field like example:'value'
    if (ts.isLiteralExpression(expression)) return expression.text;

    //nested or simple object that can have multiple parameters example:{ name: 'aaa', age:23 }
    else if (ts.isObjectLiteralExpression(expression)) {
        const parameters: { [name: string]: any } = {};
        expression.properties.forEach(property => {
            if (ts.isPropertyAssignment(property) && ts.isIdentifier(property.name)) {
                parameters[property.name.text] = ParseExpression(property.initializer);
            }
        });
        return parameters;
    }

    //array of any type with zero or more children or elements
    else if (ts.isArrayLiteralExpression(expression)) {
        let arrayElements: any = [];
        expression.elements.forEach(element => arrayElements.push(ParseExpression(element)))
        return arrayElements;
    }
}

const useTransformer = (callback: Callback) => {
    return (context: ts.TransformationContext) =>
        (sourceFile: ts.SourceFile): any => { //TODO: replace any to the type (SourceFile got broken recently :( ) 

            const visitor = (node: ts.Node): ts.Node => {
                if (ts.isCallExpression(node) && node.arguments.length >= 1 && ts.isObjectLiteralExpression(node.arguments[0])) {
                    if (ts.isIdentifier(node.expression) && node.expression.escapedText === TARGET_FUNCTION) {
                        const definition: BlokDefinition = ParseExpression(node.arguments[0] as ts.Expression);
                        callback(definition);
                    }
                }
                return ts.visitEachChild(node, visitor, context);
            };
            return ts.visitNode(sourceFile, visitor);
        };
}

export default useTransformer;