"use client";

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from '../ui/button';
import { X } from 'lucide-react';

export function DashboardFilters() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const typeFilter = searchParams.get('type');
    const severityFilter = searchParams.get('severity');

    const handleFilterChange = (key: 'type' | 'severity', value: string) => {
        const current = new URLSearchParams(Array.from(searchParams.entries()));

        if (value === 'all') {
            current.delete(key);
        } else {
            current.set(key, value);
        }

        const search = current.toString();
        const query = search ? `?${search}` : '';

        router.push(`${pathname}${query}`);
    };

    const clearFilters = () => {
        router.push(pathname);
    }

    return (
        <div className="flex items-center gap-2">
            <Select onValueChange={(value) => handleFilterChange('type', value)} value={typeFilter || 'all'}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="earthquake">Earthquake</SelectItem>
                    <SelectItem value="flood">Flood</SelectItem>
                    <SelectItem value="cyclone">Cyclone</SelectItem>
                    <SelectItem value="wildfire">Wildfire</SelectItem>
                </SelectContent>
            </Select>
            <Select onValueChange={(value) => handleFilterChange('severity', value)} value={severityFilter || 'all'}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by severity" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Severities</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
            </Select>
            {(typeFilter || severityFilter) && (
                <Button variant="ghost" size="icon" onClick={clearFilters}>
                    <X className="h-4 w-4" />
                    <span className="sr-only">Clear filters</span>
                </Button>
            )}
        </div>
    );
}
