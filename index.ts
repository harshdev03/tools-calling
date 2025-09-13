import {z} from "zod"
import { google } from "@ai-sdk/google"
import {generateText, stepCountIs, tool} from 'ai'

// no need for types but still
function calculateSum(a : number , b : number){
    return a + b
}

function calculateMultiply(a: number , b : number){
    return a * b
}

function calculateExponent(base : number , exponent : number){
    return Math.pow(base , exponent)
}




const tools = {

    sum : tool({
        description: "Calculate the sum of two numbers",

        inputSchema: z.object({
            a : z.number().describe('First Number'),
            b : z.number().describe('Second Number'),
        }),

        execute: async ({ a , b })=>{
            const result = calculateSum(a,b)
            console.log(`Sum: ${a} + ${b} = ${result}`)
            return result
        },
    }),

    multiply : tool({

        description: "Calculate the product of two numbers",
        inputSchema: z.object({
            a : z.number().describe('First Number'),
            b : z.number().describe('Second Number'),
        }),

        execute: async ({ a , b })=>{
            const result = calculateMultiply(a,b)
            console.log(`Multiplication: ${a} x ${b} = ${result}`)
            return result
        },
    }),

    power : tool({

        description: "Calculate base raised to the power of exponent",

        inputSchema: z.object({
            base : z.number().describe('Base Number'),
            exponent : z.number().describe('Exponent Number'),
        }),
        
        execute: async ({ base , exponent })=>{
            const result = calculateExponent(base,exponent)
            console.log(`Power: ${base} ^ ${exponent} = ${result}`)
            return result
        },

    }),



}

async function processQuery(query : string){
    try{

        console.log(`\nProcessing: "${query}"\n`)

        const result = await generateText({
            model: google('gemini-2.0-flash'),
            prompt : query,
            tools,
            stopWhen: stepCountIs(5) // this was missing cause only one tools is called
        })

        console.log('\nFinal response:', result.text);
        return result.text
    }catch(e){

        console.error('Error:', e);
        return null;
    }
}


async function main() {
    await processQuery('First calculate 30 + 40, then multiply the result by 2, then raise it to the power of 2')

}

main()