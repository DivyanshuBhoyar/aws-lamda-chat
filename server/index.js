const AWS = require("aws-sdk")
const ENDPOINT = "to7r3ms4d0.execute-api.us-east-1.amazonaws.com/production"
const client = new AWS.ApiGatewayManagementApi({ endpoint: ENDPOINT })
var NAMES_DB = {}

const sendToOne = async (id, body) => {
    try {
        await client.postToConnection({
            'ConnectionId': id,
            'Data': Buffer.from(JSON.stringify(body))
        }).promise()
    } catch (e) {
        console.error(e)
    }
}

const sendToAll = async (ids, body) => {
    const all = ids.map(i => sendToOne(i, body))
    return Promise.all(all)
}


exports.handler = async (event) => {

    const { connectionId, routeKey } = event.requestContext;
    let body;
    try {
        body = JSON.parse(event.body)
    } catch (e) { console.error(e) }

    switch (routeKey) {
        case '$connect':
            ///
            break;
        case '$disconnect':
            await sendToAll(Object.keys(NAMES_DB), { systemMessage: `${NAMES_DB[connectionId]} has left the chat` })
            delete NAMES_DB[connectionId]
            await sendToAll(Object.keys(NAMES_DB), { members: Object.values(NAMES_DB) })
            break;
        case '$default':
            // code
            break;
        case 'setName':
            NAMES_DB[connectionId] = body.name
            await sendToAll(Object.keys(NAMES_DB), { members: Object.values(NAMES_DB) })
            await sendToAll(Object.keys(NAMES_DB), { systemMessage: `${NAMES_DB[connectionId]} has joined the chat` })
            break;
        case 'sendPublic':
            await sendToAll(Object.keys(NAMES_DB), { publicMessage: `${NAMES_DB[connectionId]}: ${body.message}` })
            break;
        case 'sendPrivate':
            const to = Object.keys(NAMES_DB).find(key => NAMES_DB[key] === body.to)
            await sendToOne(to, { privateMessage: `${NAMES_DB[connectionId]}: ${body.message}` });
            break;

        default:
        // code
    }


    const response = {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda!'),
    };
    return response;
};