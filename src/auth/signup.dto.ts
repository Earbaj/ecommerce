import { ApiProperty } from '@nestjs/swagger';

export class SignupDto {
  @ApiProperty({ 
    example: 'user@example.com', 
    description: 'User Email Address' 
  })
  email: string;

  @ApiProperty({ 
    example: 'password123', 
    description: 'Give Strong password' 
  })
  password: string;
}
