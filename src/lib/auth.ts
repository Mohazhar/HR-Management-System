import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { db } from './db';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-key';

export interface JWTPayload {
  employeeId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export function signToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    return null;
  }
}

export async function getAuthUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value;

  if (!token) {
    return null;
  }

  const payload = verifyToken(token);
  if (!payload) {
    return null;
  }

  let employee;
  let retries = 5;
  while (retries > 0) {
    try {
      employee = await db.employee.findUnique({
        where: { employeeId: payload.employeeId },
      });
      break;
    } catch (error: any) {
      console.warn(`[DB Connection] getAuthUser fetch failed. Retries left: ${retries - 1}`);
      if (retries > 1) {
        retries--;
        await new Promise((resolve) => setTimeout(resolve, 3000));
        continue;
      }
      return null;
    }
  }
  if (!employee) {
    return null;
  }

  return {
    id: employee.id,
    employeeId: employee.employeeId,
    name: employee.name,
    email: employee.email,
    designation: employee.designation,
    department: employee.department,
    role: employee.role,
    canAddExpense: employee.canAddExpense,
    leaveBalance: JSON.parse(employee.leaveBalance),
  };
}

export async function login(email: string, password: string) {
  let employee;
  let retries = 5;
  while (retries > 0) {
    try {
      employee = await db.employee.findUnique({
        where: { email },
      });
      break;
    } catch (error: any) {
      console.warn(`[DB Connection] Prisma fetch failed. Retries left: ${retries - 1}`);
      console.warn(error);

      if (retries > 1) {
        retries--;
        await new Promise((resolve) => setTimeout(resolve, 3000));
        continue;
      }
      throw error;
    }
  }

  if (!employee) {
    return { success: false, error: 'Invalid credentials' };
  }

  const isValid = await bcrypt.compare(password, employee.password);

  if (!isValid) {
    return { success: false, error: 'Invalid credentials' };
  }

  const token = signToken({
    employeeId: employee.employeeId,
    email: employee.email,
    role: employee.role,
  });

  return {
    success: true,
    token,
    user: {
      id: employee.id,
      employeeId: employee.employeeId,
      name: employee.name,
      email: employee.email,
      designation: employee.designation,
      department: employee.department,
      role: employee.role,
      canAddExpense: employee.canAddExpense,
      leaveBalance: JSON.parse(employee.leaveBalance),
    },
  };
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('auth-token');
}
