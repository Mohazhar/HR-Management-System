import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { db } from '@/lib/db';

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await getAuthUser();

        if (!user || user.role !== 'admin') {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 403 }
            );
        }

        const { id } = await params;
        const body = await request.json();
        const { month, year, basicSalary, allowances, deductions, netSalary } = body;

        // Check if another payslip already exists for the same month/year
        const existingPayslip = await db.payslip.findFirst({
            where: {
                id: { not: id },
                employeeId: body.employeeId,
                month: parseInt(month),
                year: parseInt(year),
            },
        });

        if (existingPayslip) {
            return NextResponse.json(
                { success: false, error: 'Payslip already exists for this month' },
                { status: 400 }
            );
        }

        const payslip = await db.payslip.update({
            where: { id },
            data: {
                month: parseInt(month),
                year: parseInt(year),
                basicSalary: parseFloat(basicSalary),
                allowances: parseFloat(allowances),
                deductions: parseFloat(deductions),
                netSalary: parseFloat(netSalary),
            },
        });

        return NextResponse.json({ success: true, payslip });
    } catch (error) {
        console.error('Update payslip error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await getAuthUser();

        if (!user || user.role !== 'admin') {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 403 }
            );
        }

        const { id } = await params;

        await db.payslip.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Delete payslip error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
