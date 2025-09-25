import { GenInsightForm } from '@/components/admin/gen-insight-form';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function AdminPage() {
  return (
    <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
      <div className="grid gap-4 lg:grid-cols-2">
        <GenInsightForm />

        <Card>
            <CardHeader>
                <CardTitle>System Analytics</CardTitle>
                <CardDescription>Placeholder for detailed system analytics and charts.</CardDescription>
            </CardHeader>
            <CardContent className='flex items-center justify-center h-80 bg-muted rounded-b-lg'>
                <p className='text-muted-foreground'>Analytics charts coming soon.</p>
            </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="px-7">
          <CardTitle>Manage Alerts</CardTitle>
          <CardDescription>Review, edit, or manually issue disaster alerts.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Location</TableHead>
                <TableHead className="hidden sm:table-cell">Type</TableHead>
                <TableHead className="hidden sm:table-cell">Severity</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>
                  <div className="font-medium">San Francisco, USA</div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">Earthquake</TableCell>
                <TableCell className="hidden sm:table-cell">
                  <Badge className="text-xs" variant="destructive">
                    High
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">2024-07-20</TableCell>
                <TableCell className="text-right">
                    <Button size="sm" variant="outline">Manage</Button>
                </TableCell>
              </TableRow>
               <TableRow>
                <TableCell>
                  <div className="font-medium">Miami, USA</div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">Flood</TableCell>
                <TableCell className="hidden sm:table-cell">
                  <Badge className="text-xs" variant="secondary">
                    Medium
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">2024-07-21</TableCell>
                <TableCell className="text-right">
                    <Button size="sm" variant="outline">Manage</Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
