

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
            <div className="flex min-h-screen font-display">       

                <div className="flex flex-1 flex-col">
                 
               
                    <main className="flex-1 bg-muted/30 p-4 md:p-8">
                        <div className="max-w-6xl mx-auto animate-in fade-in duration-500">

                            {children}
                        </div>
                    </main>
                </div>
            </div>

   
    );
}