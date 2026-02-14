export default function DashboardLoading() {
    return (
        <div className="p-8 lg:p-12 space-y-12 animate-pulse">
            <div className="flex justify-between items-end">
                <div className="space-y-4">
                    <div className="w-48 h-4 bg-muted rounded-full" />
                    <div className="w-96 h-20 bg-muted rounded-2xl" />
                    <div className="w-64 h-4 bg-muted rounded-full" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-64 bg-muted rounded-3xl" />
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-2 h-96 bg-muted rounded-3xl" />
                <div className="h-96 bg-muted rounded-3xl" />
            </div>
        </div>
    );
}
