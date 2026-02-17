import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginationProps {
    links: PaginationLink[];
}

export function Pagination({ links }: PaginationProps) {
    if (links.length <= 3) {
        return null;
    }

    return (
        <nav className="flex items-center justify-center gap-1 py-4">
            {links.map((link, index) => {
                if (index === 0) {
                    return (
                        <Button
                            key="prev"
                            variant="outline"
                            size="sm"
                            disabled={!link.url}
                            asChild={!!link.url}
                        >
                            {link.url ? (
                                <Link href={link.url} preserveScroll>
                                    <ChevronLeft className="h-4 w-4" />
                                </Link>
                            ) : (
                                <span>
                                    <ChevronLeft className="h-4 w-4" />
                                </span>
                            )}
                        </Button>
                    );
                }

                if (index === links.length - 1) {
                    return (
                        <Button
                            key="next"
                            variant="outline"
                            size="sm"
                            disabled={!link.url}
                            asChild={!!link.url}
                        >
                            {link.url ? (
                                <Link href={link.url} preserveScroll>
                                    <ChevronRight className="h-4 w-4" />
                                </Link>
                            ) : (
                                <span>
                                    <ChevronRight className="h-4 w-4" />
                                </span>
                            )}
                        </Button>
                    );
                }

                return (
                    <Button
                        key={index}
                        variant={link.active ? 'default' : 'outline'}
                        size="sm"
                        disabled={!link.url}
                        asChild={!!link.url}
                    >
                        {link.url ? (
                            <Link
                                href={link.url}
                                preserveScroll
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ) : (
                            <span dangerouslySetInnerHTML={{ __html: link.label }} />
                        )}
                    </Button>
                );
            })}
        </nav>
    );
}
