import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
//import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
/* export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private jwtService: JwtService) {
        super();   
    }
    
    async canActivate(context: any) { 
        //specify http requests
        const request = context.switchToHttp().getRequest();
        const authorization = request.headers['authorization'];
        if (!authorization) {
            throw new UnauthorizedException('Authorization header missing')
        }
        //get token
        const token = authorization.split(' ')[1];
        try {
            //attach user details to token
            const decoded = this.jwtService.decode(token);
            request.user = decoded;
            return true;
        } catch (error) {
            throw new UnauthorizedException('Invalid token used here');
        }

    }
    /* private extractTokenFromHeader(request: any): string | undefined {
        const bearerToken = request.headers['authorization'];
        if (bearerToken && bearerToken.startsWith('Bearer ')) {
            return bearerToken.slice(7); //remove the 'Bearer ' prefix
        }
        return undefined;
    } 
}  */
