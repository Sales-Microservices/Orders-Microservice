import { Catch, ArgumentsHost, ExceptionFilter } from '@nestjs/common';

import { RpcException } from '@nestjs/microservices';

@Catch(RpcException)
export class RpcCustomExceptionFilter implements ExceptionFilter {
    catch(exception: RpcException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();

        const rpcError = exception.getError();

        if (
            typeof rpcError === 'object' &&
            rpcError !== null &&
            'status' in rpcError &&
            'message' in rpcError
        ) {
            const { status } = rpcError as { status: unknown; message: unknown };
            const numericStatus = isNaN(Number(status)) ? 400 : Number(status);
            return response.status(numericStatus).json(rpcError);
        }

        response.status(400).json({
            status: 400,
            message: rpcError,
        });
    }
}