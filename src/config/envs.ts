import 'dotenv/config';

import * as joi from 'joi';

interface EnvVars {
    PORT: number;
    NATS_SERVERS: string[]
}

const envSchema = joi.object({
    PORT: joi.number().required(),
    NATS_SERVERS: joi.array().items(joi.string()).required(),
})
    .unknown(true);




const { error, value } = envSchema.validate({
    ...process.env,
    NATS_SERVERS: process.env.NATS_SERVERS?.split(',')
});

const envVars: EnvVars = value;


export const envs = {
    port: envVars.PORT,
    nats_servers: envVars.NATS_SERVERS

};