# @repo/validation

This package contains Zod validation schemas for the Jira clone application.

## Features

- **User Validation**: Complete validation schemas for user operations
- **Type Safety**: Full TypeScript support with inferred types
- **Reusable Schemas**: Modular validation schemas for different use cases

## Usage

```typescript
import { 
  createUserSchema, 
  updateUserSchema, 
  loginUserSchema,
  type CreateUserInput 
} from "@repo/validation";

// Validate user creation data
const userData = {
  email: "user@example.com",
  password: "securepassword123",
  confirmPassword: "securepassword123",
  name: "John Doe",
  slug: "john-doe"
};

const result = createUserSchema.safeParse(userData);
if (result.success) {
  const validatedData: CreateUserInput = result.data;
  // Use validated data
} else {
  console.log(result.error.errors);
}
```

## Available Schemas

### User Validation
- `userSchema` - Base user validation
- `createUserSchema` - User creation with password confirmation
- `updateUserSchema` - User updates (partial)
- `loginUserSchema` - User login
- `userProfileSchema` - User profile updates

## Installation

This package is part of the monorepo and should be installed as a dependency in other packages:

```bash
pnpm add @repo/validation
```

## Development

```bash
# Build the package
pnpm build

# Watch for changes
pnpm dev
```
