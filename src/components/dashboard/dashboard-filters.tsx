
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
import { useCallback } from 'react';

export function DashboardFilters() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const typeFilter = searchParams.get('type') || 'all';
    const severityFilter = searchParams.get('severity') || 'all';

    const createQueryString = useCallback(
      (paramsToUpdate: Record<string, string>) => {
        const current = new URLSearchParams(Array.from(searchParams.entries()));
        Object.entries(paramsToUpdate).forEach(([key, value]) => {
            if (value === 'all' || !value) {
                current.delete(key);
            } else {
                current.set(key, value);
            }
        });
        const search = current.toString();
        return search ? `?${search}` : '';
      },
      [searchParams]
    )

    const handleFilterChange = (key: 'type' | 'severity', value: string) => {
        const query = createQueryString({ [key]: value });
        router.push(`${pathname}${query}`);
    };

    const clearFilters = () => {
        router.push(pathname);
    }

    return (
        <div className="flex items-center gap-2">
            <Select onValueChange={(value) => handleFilterChange('type', value)} value={typeFilter}>
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
            <Select onValueChange={(value) => handleFilterChange('severity', value)} value={severityFilter}>
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
            {(typeFilter !== 'all' || severityFilter !== 'all') && (
                <Button variant="ghost" size="icon" onClick={clearFilters}>
                    <X className="h-4 w-4" />
                    <span className="sr-only">Clear filters</span>
                </Button>
            )}
        </div>
    );
}
