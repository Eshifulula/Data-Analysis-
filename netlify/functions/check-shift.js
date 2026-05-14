import { currentShiftNairobi } from './_auth.js';import { json } from './_db.js';
export async function handler(event){if(event.httpMethod!=='GET') return json(405,{error:'Method not allowed'});return json(200,currentShiftNairobi());}
