import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import * as bcrypt from 'bcryptjs';
import { Role, BCRYPT_SALT_ROUNDS } from '@/common';
import { Public } from '@/decorator';
import { OrganizationService, UserService } from '@/services';
import { OrganizationResponseDto, SeedDto, UserSeedResponseDto } from '@/utils';

@ApiTags('SeedUser')
@Controller('seedUser')
export class UserSeedController {
  constructor(
    private readonly userService: UserService,
    private readonly organizationService: OrganizationService,
    //private readonly organizationController: OrganizationController,
  ) {}

  //@Roles(Role.ADMIN)
  @Public()
  @Post('/')
  async createSeedUser(@Body() seedDto: SeedDto): Promise<UserSeedResponseDto> {
    console.log('seedDto:', seedDto.organizationData);
    const orgData: OrganizationResponseDto =
      await this.organizationService.createOrganization({
        organizationName: seedDto.organizationData.organizationName,
      });
    console.log('orgData:', orgData);
    if (!orgData) {
      throw new HttpException(
        'Unable to create organization',
        HttpStatus.BAD_REQUEST,
      );
    } else {
      const hashedPassword = await bcrypt.hash(
        seedDto.userData.password,
        BCRYPT_SALT_ROUNDS,
      );
      const isUserExits = await this.userService.CheckUsername({
        userName: seedDto.userData.userName,
        emailId: seedDto.userData.email,
      });

      if (isUserExits) {
        throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
      } else {
        //const organization = orgData.message.organizationId;
        //     const resultUserData: any = {
        //       userName: userData.userName,
        //       name: userData.name,
        //       email: userData.email,
        //       employeeId: userData.employeeId,
        //       position: userData.position,
        //       role: userData.role,
        //       password: hashedPassword,
        //       organization: {
        //         connect: [
        //           {
        //             organizationId: organization,
        //           },
        //         ],
        //       },
        //     };
        //   }
        if (seedDto.userData.role === Role.ADMIN) {
          const result = await this.userService.createAdmin({
            userName: seedDto.userData.userName,
            name: seedDto.userData.name,
            email: seedDto.userData.email,
            employeeId: seedDto.userData.employeeId,
            position: seedDto.userData.position,
            role: seedDto.userData.role,
            password: hashedPassword,
            organization: {
              connect: [
                {
                  organizationId: orgData.message.organizationId,
                },
              ],
            },
          });
          return {
            statusCode: HttpStatus.OK,
            message: {
              organization: orgData.message,
              user: result.message,
            },
          };
        }
      }
    }
  }
}
