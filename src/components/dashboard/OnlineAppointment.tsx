import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2 } from 'lucide-react';

interface Appointment {
  id: string;
  no: string;
  name: string;
  dateTime: string;
  age: number;
  gender: string;
  appointFor: string;
}

export function OnlineAppointment({
  appointments,
}: {
  appointments: Appointment[];
}) {
  return (
    <Card className="border-none shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between px-6">
        <CardTitle className="text-lg font-bold">Online Appointment</CardTitle>
        <Button variant="ghost" size="sm" className="text-muted-foreground">
          View All
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-muted-foreground border-b text-sm">
                <th className="px-6 py-4 font-medium">No.</th>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Date & Time</th>
                <th className="px-6 py-4 font-medium">Age</th>
                <th className="px-6 py-4 font-medium">Gender</th>
                <th className="px-6 py-4 font-medium">Appoint for</th>
                <th className="px-6 py-4 font-medium text-right">Setting</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {appointments.map((apt) => (
                <tr
                  key={apt.id}
                  className="hover:bg-muted transition-colors text-sm"
                >
                  <td className="px-6 py-4 font-bold text-foreground">
                    {apt.no}
                  </td>
                  <td className="px-6 py-4 text-foreground">{apt.name}</td>
                  <td className="px-6 py-4 text-foreground">{apt.dateTime}</td>
                  <td className="px-6 py-4 text-foreground">{apt.age}</td>
                  <td className="px-6 py-4 text-foreground">{apt.gender}</td>
                  <td className="px-6 py-4 text-foreground">
                    {apt.appointFor}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-primary hover:text-primary/80 hover:bg-primary/10"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
