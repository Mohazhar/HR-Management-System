import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Clock, Loader2, Calendar } from 'lucide-react';

interface Attendance {
    id: string;
    date: string;
    checkIn: string;
    checkOut: string | null;
    status: string;
}

export default function AttendancePage() {
    const { user } = useAuth();
    const [attendances, setAttendances] = useState<Attendance[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAttendance = async () => {
            try {
                const res = await fetch('/api/attendance');
                const data = await res.json();
                if (data.success) {
                    setAttendances(data.attendances);
                }
            } catch (err) {
                console.error('Error fetching attendance records:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchAttendance();
    }, []);

    if (!user) return null;

    return (
        <div className="p-4 lg:p-6 space-y-6">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-[#ea580c]">My Attendance</h1>
                <p className="text-gray-500">View your daily check-in and check-out records</p>
            </div>

            <Card className="border-0 shadow-md">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold text-[#ea580c]">Attendance History</CardTitle>
                    <CardDescription>Your log of daily work hours</CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="w-6 h-6 animate-spin text-[#ea580c]" />
                        </div>
                    ) : attendances.length > 0 ? (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Check In</TableHead>
                                        <TableHead>Check Out</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {attendances.map((record) => (
                                        <TableRow key={record.id}>
                                            <TableCell className="font-medium text-[#ea580c]">
                                                <div className="flex items-center">
                                                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                                                    {new Date(record.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {new Date(record.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </TableCell>
                                            <TableCell>
                                                {record.checkOut
                                                    ? new Date(record.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                                    : <span className="text-gray-400 italic">Not checked out</span>}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={record.checkOut ? "secondary" : "default"} className={!record.checkOut ? "bg-green-500" : ""}>
                                                    {record.checkOut ? 'Completed' : 'Working'}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-400">
                            <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
                            <p>No attendance records found yet.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
