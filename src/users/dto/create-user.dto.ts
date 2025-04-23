export class CreateUserDto {
  email: string;
  password: string;
  name?: string;
  roles?: string[]; // Optional if dynamically assigned in service
  isActive?: boolean; // Optional, default handled in the schema/service
}
