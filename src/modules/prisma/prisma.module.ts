import { Global, Module } from "@nestjs/common";
import { PrismaService } from "services/prisma/prisma.service";
import { PrismaDynamicQueries } from "utils/dynamicQueries/PrismaDynamicQueries";




@Global()
@Module({
    imports:[],
    providers:[PrismaService,PrismaDynamicQueries],
    exports:[PrismaService,PrismaDynamicQueries]
})

export class PrismaModule{}