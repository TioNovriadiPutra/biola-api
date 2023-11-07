interface UserInput {
  email?: string;
  password?: string;
  password_confirmation?: string;
  fullName?: string;
  batchId?: number;
}

interface LoginInput {
  email?: string;
  password?: string;
}

interface BatchInput {
  batch?: string;
}
