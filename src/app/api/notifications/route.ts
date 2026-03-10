import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
    try {
        const user = await getAuthUser();

        if (!user) {
            return NextResponse.json(
                { success: false, error: 'Not authenticated' },
                { status: 401 }
            );
        }

        const notifications = await db.notification.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: 'desc' },
            take: 20,
        });

        const unreadCount = await db.notification.count({
            where: { userId: user.id, isRead: false },
        });

        return NextResponse.json({ success: true, notifications, unreadCount });
    } catch (error) {
        console.error('Get notifications error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest) {
    try {
        const user = await getAuthUser();

        if (!user) {
            return NextResponse.json(
                { success: false, error: 'Not authenticated' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { notificationId } = body;

        if (notificationId) {
            // Mark specific notification as read
            await db.notification.update({
                where: { id: notificationId, userId: user.id },
                data: { isRead: true },
            });
        } else {
            // Mark all as read
            await db.notification.updateMany({
                where: { userId: user.id, isRead: false },
                data: { isRead: true },
            });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Update notifications error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
